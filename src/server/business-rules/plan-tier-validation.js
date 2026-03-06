import { gs, GlideRecord } from '@servicenow/glide'

export function validatePlanTierConfiguration(current, previous) {
    var floor = parseFloat(current.getValue('attainment_floor_percent')) || 0;
    var ceilingRaw = parseFloat(current.getValue('attainment_ceiling_percent'));
    var hasCeiling = !isNaN(ceilingRaw) && ceilingRaw > 0;
    var ceiling = hasCeiling ? ceilingRaw : null;
    var rate = parseFloat(current.getValue('commission_rate_percent')) || 0;
    var planTargetId = (current.getValue('plan_target') || '').toString();
    var linkedTarget = null;

    if (!planTargetId) {
        gs.addErrorMessage('Plan Target is required. Tiers must be attached to a specific target in the referential hierarchy.');
        current.setAbortAction(true);
        return;
    }

    linkedTarget = new GlideRecord('x_823178_commissio_plan_targets');
    if (!linkedTarget.get(planTargetId)) {
        gs.addErrorMessage('Selected Plan Target is invalid.');
        current.setAbortAction(true);
        return;
    }

    var planFromTarget = (linkedTarget.getValue('commission_plan') || '').toString();
    var planFromTier = (current.getValue('commission_plan') || '').toString();
    if (!planFromTarget) {
        gs.addErrorMessage('Plan Target must reference a Commission Plan.');
        current.setAbortAction(true);
        return;
    }

    if (!planFromTier) {
        current.setValue('commission_plan', planFromTarget);
    } else if (planFromTier !== planFromTarget) {
        gs.addErrorMessage('Tier Commission Plan must match the selected Plan Target Commission Plan.');
        current.setAbortAction(true);
        return;
    }

    if (!validateLinkedTargetDealType(linkedTarget)) {
        current.setAbortAction(true);
        return;
    }

    if (!current.getValue('commission_plan')) {
        gs.addErrorMessage('Commission plan is required for tier configuration');
        current.setAbortAction(true);
        return;
    }

    if (floor < 0) {
        gs.addErrorMessage('Tier floor must be zero or greater');
        current.setAbortAction(true);
        return;
    }

    if (!hasCeiling) {
        gs.addErrorMessage('Tier ceiling is required. Define explicit non-overlapping floor/ceiling bands.');
        current.setAbortAction(true);
        return;
    }

    if (ceiling <= floor) {
        gs.addErrorMessage('Tier ceiling must be greater than tier floor');
        current.setAbortAction(true);
        return;
    }

    if (rate <= 0 || rate > 100) {
        gs.addErrorMessage('Tier commission rate must be greater than 0 and at most 100');
        current.setAbortAction(true);
        return;
    }

    // Only enforce overlap validation for active tiers.
    if (current.getValue('is_active') === 'false') {
        return;
    }

    var overlapGr = new GlideRecord('x_823178_commissio_plan_tiers');
    overlapGr.addQuery('plan_target', planTargetId);
    overlapGr.addQuery('is_active', true);
    overlapGr.addQuery('sys_id', '!=', current.sys_id);
    overlapGr.query();

    while (overlapGr.next()) {
        var otherFloor = parseFloat(overlapGr.getValue('attainment_floor_percent')) || 0;
        var otherCeilingRaw = parseFloat(overlapGr.getValue('attainment_ceiling_percent'));
        var otherHasCeiling = !isNaN(otherCeilingRaw) && otherCeilingRaw > 0;
        var otherCeiling = otherHasCeiling ? otherCeilingRaw : null;

        if (tierRangeOverlaps(floor, ceiling, otherFloor, otherCeiling)) {
            var overlapName = overlapGr.getValue('tier_name') || overlapGr.sys_id;
            gs.addErrorMessage('Tier range overlaps with existing tier "' + overlapName + '" in the same plan/scope. Adjust floor/ceiling to create non-overlapping bands.');
            current.setAbortAction(true);
            return;
        }
    }

    if (!validateContiguousCoverage(current, floor, ceiling, planTargetId)) {
        current.setAbortAction(true);
        return;
    }
}

function tierRangeOverlaps(leftFloor, leftCeiling, rightFloor, rightCeiling) {
    var leftHigh = leftCeiling === null ? Number.POSITIVE_INFINITY : leftCeiling;
    var rightHigh = rightCeiling === null ? Number.POSITIVE_INFINITY : rightCeiling;

    // Half-open interval overlap: [floor, ceiling)
    return leftFloor < rightHigh && rightFloor < leftHigh;
}

function validateContiguousCoverage(current, currentFloor, currentCeiling, planTargetId) {
    var ranges = [];

    var tierGr = new GlideRecord('x_823178_commissio_plan_tiers');
    tierGr.addQuery('plan_target', planTargetId);
    tierGr.addQuery('is_active', true);
    tierGr.addQuery('sys_id', '!=', current.sys_id);
    tierGr.query();

    while (tierGr.next()) {
        var floor = parseFloat(tierGr.getValue('attainment_floor_percent')) || 0;
        var ceiling = parseFloat(tierGr.getValue('attainment_ceiling_percent'));
        if (isNaN(ceiling) || ceiling <= floor) {
            gs.addErrorMessage('All active tiers in a scope must have valid floor/ceiling ranges before saving.');
            return false;
        }

        ranges.push({ floor: floor, ceiling: ceiling });
    }

    ranges.push({ floor: currentFloor, ceiling: currentCeiling });
    ranges.sort(function(a, b) { return a.floor - b.floor; });

    if (!ranges.length) {
        return true;
    }

    if (Math.abs((ranges[0].floor || 0) - 0) > 0.0001) {
        gs.addErrorMessage('Tier bands must start at 0% attainment for each deal type scope.');
        return false;
    }

    for (var i = 1; i < ranges.length; i++) {
        var prev = ranges[i - 1];
        var next = ranges[i];
        if (Math.abs((prev.ceiling || 0) - (next.floor || 0)) > 0.0001) {
            gs.addErrorMessage('Tier bands must be contiguous with no gaps for each scope (previous ceiling must equal next floor).');
            return false;
        }
    }

    return true;
}

function validateLinkedTargetDealType(linkedTarget) {
    var targetRef = linkedTarget ? (linkedTarget.getValue('deal_type_ref') || '').toString() : '';
    if (!targetRef) {
        gs.addErrorMessage('Plan Target must define an active Deal Type reference before tiers can be saved.');
        return false;
    }

    if (!getActiveDealTypeById(targetRef)) {
        gs.addErrorMessage('Plan Target Deal Type reference must point to an active governed Deal Type.');
        return false;
    }

    return true;
}

function getActiveDealTypeById(sysId) {
    if (!sysId) {
        return null;
    }
    var typeGr = new GlideRecord('x_823178_commissio_deal_types');
    if (!typeGr.get(sysId)) {
        return null;
    }
    if (typeGr.getValue('is_active') !== 'true' && typeGr.getValue('is_active') !== true) {
        return null;
    }
    return {
        id: typeGr.getUniqueValue(),
        code: (typeGr.getValue('code') || '').toString()
    };
}
