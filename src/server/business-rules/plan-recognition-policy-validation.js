import { gs, GlideRecord, GlideDateTime } from '@servicenow/glide'
import { CALC_STATUS } from '../script-includes/status-model.js'

export function validatePlanRecognitionPolicy(current, previous) {
    if (!current.getValue('commission_plan')) {
        gs.addErrorMessage('Commission plan is required for recognition policy.');
        current.setAbortAction(true);
        return;
    }

    var basis = (current.getValue('recognition_basis') || '').toString().trim();
    if (!isSupportedRecognitionBasis(basis)) {
        gs.addErrorMessage('Recognition basis must be one of: cash_received, invoice_issued, booking, milestone.');
        current.setAbortAction(true);
        return;
    }

    if (!current.getValue('effective_start_date')) {
        gs.addErrorMessage('Effective start date is required.');
        current.setAbortAction(true);
        return;
    }

    var startDate = new GlideDateTime();
    startDate.setValue(current.getValue('effective_start_date'));
    var endDate = null;

    if (current.getValue('effective_end_date')) {
        endDate = new GlideDateTime();
        endDate.setValue(current.getValue('effective_end_date'));

        if (endDate.before(startDate)) {
            gs.addErrorMessage('Effective end date must be on or after effective start date.');
            current.setAbortAction(true);
            return;
        }
    }

    if (!current.getValue('version_number')) {
        current.setValue('version_number', getNextVersion(current.getValue('commission_plan')));
    }

    if (!current.getValue('is_active')) {
        return;
    }

    var overlap = findOverlap(current, startDate, endDate);
    if (overlap) {
        if (!hasApprovedOverride(current.getUniqueValue(), 'recognition_policy_overlap')) {
            gs.addErrorMessage(
                'Recognition policy overlaps active policy version ' + overlap.version +
                ' (' + overlap.start + ' to ' + overlap.end + '). Adjust dates or submit exception request type "Recognition Policy Overlap".'
            );
            current.setAbortAction(true);
            return;
        }

        gs.addInfoMessage('Recognition policy overlap approved via exception process.');
    }

    if (previous && previous.sys_id && hasFrozenCalculationImpact(current, previous)) {
        if (!hasApprovedOverride(current.getUniqueValue(), 'recognition_policy_change')) {
            gs.addErrorMessage('Cannot change recognition policy fields after finalized calculations exist without approved Recognition Policy Change exception.');
            current.setAbortAction(true);
            return;
        }

        gs.addInfoMessage('Recognition policy change approved with existing finalized calculations.');
    }
}

function isSupportedRecognitionBasis(basis) {
    return basis === 'cash_received' || basis === 'invoice_issued' || basis === 'booking' || basis === 'milestone';
}

function getNextVersion(planId) {
    var policyGr = new GlideRecord('x_823178_commissio_plan_recognition_policies');
    policyGr.addQuery('commission_plan', planId);
    policyGr.orderByDesc('version_number');
    policyGr.setLimit(1);
    policyGr.query();

    if (policyGr.next()) {
        return (parseInt(policyGr.getValue('version_number'), 10) || 0) + 1;
    }

    return 1;
}

function findOverlap(current, currentStart, currentEnd) {
    var overlapGr = new GlideRecord('x_823178_commissio_plan_recognition_policies');
    overlapGr.addQuery('commission_plan', current.getValue('commission_plan'));
    overlapGr.addQuery('sys_id', '!=', current.sys_id);
    overlapGr.addQuery('is_active', true);
    overlapGr.query();

    while (overlapGr.next()) {
        var existingStart = new GlideDateTime();
        existingStart.setValue(overlapGr.getValue('effective_start_date'));

        var existingEnd = null;
        if (overlapGr.getValue('effective_end_date')) {
            existingEnd = new GlideDateTime();
            existingEnd.setValue(overlapGr.getValue('effective_end_date'));
        }

        var hasOverlap = false;

        if (currentEnd && existingEnd) {
            hasOverlap = currentStart.before(existingEnd) && currentEnd.after(existingStart);
        } else if (currentEnd && !existingEnd) {
            hasOverlap = !currentEnd.before(existingStart);
        } else if (!currentEnd && existingEnd) {
            hasOverlap = currentStart.before(existingEnd);
        } else {
            hasOverlap = true;
        }

        if (hasOverlap) {
            return {
                version: overlapGr.getValue('version_number') || 'n/a',
                start: overlapGr.getValue('effective_start_date'),
                end: overlapGr.getValue('effective_end_date') || 'Open-ended'
            };
        }
    }

    return null;
}

function hasFrozenCalculationImpact(current, previous) {
    var watchedFields = ['recognition_basis', 'effective_start_date', 'effective_end_date', 'commission_plan', 'is_active'];
    var changed = false;

    for (var i = 0; i < watchedFields.length; i++) {
        if ((current.getValue(watchedFields[i]) || '') !== (previous.getValue(watchedFields[i]) || '')) {
            changed = true;
            break;
        }
    }

    if (!changed) {
        return false;
    }

    var calcGr = new GlideRecord('x_823178_commissio_commission_calculations');
    calcGr.addQuery('commission_plan', current.getValue('commission_plan'));
    calcGr.addQuery('status', '!=', CALC_STATUS.DRAFT);
    calcGr.setLimit(1);
    calcGr.query();

    return calcGr.next();
}

function hasApprovedOverride(recordId, requestType) {
    var approvalGr = new GlideRecord('x_823178_commissio_exception_approvals');
    approvalGr.addQuery('reference_record', recordId);
    approvalGr.addQuery('request_type', requestType);
    approvalGr.addQuery('status', 'approved');
    approvalGr.orderByDesc('approval_date');
    approvalGr.setLimit(1);
    approvalGr.query();
    return approvalGr.next();
}
