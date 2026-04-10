import { gs, GlideRecord, GlideDateTime } from '@servicenow/glide'

export function getApprovedOverrideDetails(recordId, requestType) {
    var approvalGr = new GlideRecord('x_823178_commissio_exception_approvals');
    approvalGr.addQuery('reference_record', recordId);
    approvalGr.addQuery('request_type', requestType);
    approvalGr.addQuery('status', 'approved');
    approvalGr.orderByDesc('approval_date');
    approvalGr.setLimit(1);
    approvalGr.query();

    if (!approvalGr.next()) {
        return null;
    }

    return {
        approval_id: approvalGr.getUniqueValue(),
        approved_by: approvalGr.getValue('approved_by') || '',
        approval_date: approvalGr.getValue('approval_date') || '',
        business_justification: approvalGr.getValue('business_justification') || ''
    };
}

export function getApprovedOverrideJustification(recordId, requestType) {
    var details = getApprovedOverrideDetails(recordId, requestType);
    return details ? (details.business_justification || true) : false;
}

export function createSystemAlert(title, message, severity, status) {
    try {
        var alertGr = new GlideRecord('x_823178_commissio_system_alerts');
        alertGr.initialize();
        alertGr.setValue('title', title);
        alertGr.setValue('message', message);
        alertGr.setValue('severity', severity || 'medium');
        alertGr.setValue('alert_date', new GlideDateTime().getDisplayValue());
        alertGr.setValue('status', status || 'open');
        alertGr.insert();
    } catch (e) {
        gs.error('Commission Management: Failed to create system alert - ' + e.message);
    }
}

export function createOverrideAuditLog(eventType, details, severity) {
    createSystemAlert('Approved Override: ' + eventType, details, severity || 'medium', 'resolved');
}

export function createReconciliationLog(entry) {
    try {
        var data = entry || {};
        var logGr = new GlideRecord('x_823178_commissio_reconciliation_log');
        logGr.initialize();
        logGr.setValue('reconciliation_date', data.reconciliation_date || new GlideDateTime().getDisplayValue());
        logGr.setValue('records_checked', normalizeInt(data.records_checked));
        logGr.setValue('total_variances', normalizeInt(data.total_variances));
        logGr.setValue('significant_variances', normalizeInt(data.significant_variances));
        logGr.setValue('errors_found', normalizeInt(data.errors_found));
        logGr.setValue('warnings_found', normalizeInt(data.warnings_found));
        logGr.setValue('status', normalizeStatus(data.status));
        logGr.setValue('processing_time_seconds', normalizeInt(data.processing_time_seconds));
        logGr.setValue('details', truncate(String(data.details || ''), 4000));
        logGr.insert();
    } catch (e) {
        gs.error('Commission Management: Failed to create reconciliation log entry - ' + e.message);
    }
}

function normalizeInt(value) {
    var parsed = parseInt(value, 10);
    return isNaN(parsed) ? 0 : parsed;
}

function normalizeStatus(value) {
    var status = String(value || 'passed').toLowerCase();
    if (status === 'failed' || status === 'warning' || status === 'passed') {
        return status;
    }
    return 'passed';
}

function truncate(value, max) {
    if (!value) {
        return '';
    }
    return value.length > max ? value.substring(0, max) : value;
}
