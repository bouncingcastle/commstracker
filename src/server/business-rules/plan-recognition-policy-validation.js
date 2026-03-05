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

    if (!validatePolicyLifecycleAndVersion(current)) {
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

function isTruthyBoolean(value) {
    var normalized = String(value || '').toLowerCase();
    return normalized === 'true' || normalized === '1';
}

function validatePolicyLifecycleAndVersion(current) {
    var policyState = (current.getValue('policy_state') || 'active').toString();
    var supportedStates = {
        draft: true,
        active: true,
        retired: true,
        superseded: true
    };

    if (!supportedStates[policyState]) {
        gs.addErrorMessage('Policy State must be one of: draft, active, retired, superseded.');
        return false;
    }

    var version = parseInt(current.getValue('version_number'), 10);
    if (isNaN(version) || version <= 0) {
        gs.addErrorMessage('Policy Version must be a positive integer.');
        return false;
    }

    var isActive = isTruthyBoolean(current.getValue('is_active'));
    if (policyState === 'active' && !isActive) {
        gs.addErrorMessage('Policy State "active" requires Active = true.');
        return false;
    }

    if ((policyState === 'retired' || policyState === 'superseded') && isActive) {
        gs.addErrorMessage('Retired/Superseded policies must have Active = false.');
        return false;
    }

    var supersedesPolicy = (current.getValue('supersedes_policy') || '').toString();
    if (!supersedesPolicy) {
        return true;
    }

    if (supersedesPolicy === current.getUniqueValue()) {
        gs.addErrorMessage('A policy cannot supersede itself.');
        return false;
    }

    var priorPolicy = new GlideRecord('x_823178_commissio_plan_recognition_policies');
    if (!priorPolicy.get(supersedesPolicy)) {
        gs.addErrorMessage('Supersedes Policy reference is invalid.');
        return false;
    }

    if ((priorPolicy.getValue('commission_plan') || '') !== (current.getValue('commission_plan') || '')) {
        gs.addErrorMessage('Superseded policy must belong to the same commission plan.');
        return false;
    }

    if ((priorPolicy.getValue('recognition_basis') || '') !== (current.getValue('recognition_basis') || '')) {
        gs.addErrorMessage('Superseded policy must use the same recognition basis.');
        return false;
    }

    var priorVersion = parseInt(priorPolicy.getValue('version_number'), 10) || 0;
    if (version <= priorVersion) {
        gs.addErrorMessage('Policy Version must be greater than the superseded policy version (' + priorVersion + ').');
        return false;
    }

    var priorSupersedes = (priorPolicy.getValue('supersedes_policy') || '').toString();
    if (priorSupersedes && priorSupersedes === current.getUniqueValue()) {
        gs.addErrorMessage('Invalid policy supersede chain detected (cycle).');
        return false;
    }

    return true;
}
