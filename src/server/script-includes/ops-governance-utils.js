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
