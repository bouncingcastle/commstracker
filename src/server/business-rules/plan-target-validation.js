import { gs, GlideRecord } from '@servicenow/glide'

export function validatePlanTargetConfiguration(current, previous) {
    var planId = (current.getValue('commission_plan') || '').toString();
    var dealTypeId = (current.getValue('deal_type_ref') || '').toString();
    var annualTarget = parseFloat(current.getValue('annual_target_amount')) || 0;
    var ratePercent = parseFloat(current.getValue('commission_rate_percent')) || 0;

    if (!planId) {
        gs.addErrorMessage('Commission Plan is required for plan targets.');
        current.setAbortAction(true);
        return;
    }

    if (!dealTypeId) {
        gs.addErrorMessage('Deal Type is required for plan targets.');
        current.setAbortAction(true);
        return;
    }

    if (annualTarget <= 0) {
        gs.addErrorMessage('Annual target amount must be greater than zero.');
        current.setAbortAction(true);
        return;
    }

    if (ratePercent <= 0 || ratePercent > 100) {
        gs.addErrorMessage('Commission rate must be greater than 0 and at most 100.');
        current.setAbortAction(true);
        return;
    }

    var planGr = new GlideRecord('x_823178_commissio_commission_plans');
    if (!planGr.get(planId)) {
        gs.addErrorMessage('Commission Plan reference is invalid.');
        current.setAbortAction(true);
        return;
    }

    var dealTypeGr = new GlideRecord('x_823178_commissio_deal_types');
    if (!dealTypeGr.get(dealTypeId)) {
        gs.addErrorMessage('Deal Type reference is invalid.');
        current.setAbortAction(true);
        return;
    }

    if (!isActiveFlag(dealTypeGr.getValue('is_active'))) {
        gs.addErrorMessage('Deal Type must be active for plan targets.');
        current.setAbortAction(true);
        return;
    }

    if (!isActiveFlag(current.getValue('is_active'))) {
        return;
    }

    // Enforce one active target row per plan+deal type to keep quota and estimator payload deterministic.
    var dupeGr = new GlideRecord('x_823178_commissio_plan_targets');
    dupeGr.addQuery('commission_plan', planId);
    dupeGr.addQuery('deal_type_ref', dealTypeId);
    dupeGr.addQuery('is_active', true);
    dupeGr.addQuery('sys_id', '!=', current.getUniqueValue());
    dupeGr.setLimit(1);
    dupeGr.query();

    if (dupeGr.next()) {
        gs.addErrorMessage('Only one active target is allowed per plan and deal type. Deactivate the existing target before creating another.');
        current.setAbortAction(true);
    }
}

function isActiveFlag(value) {
    if (value === true || value === 1) {
        return true;
    }
    var normalized = (value || '').toString().toLowerCase();
    return normalized === 'true' || normalized === '1';
}
