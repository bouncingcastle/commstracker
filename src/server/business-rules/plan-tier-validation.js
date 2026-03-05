import { gs, GlideRecord } from '@servicenow/glide'
import { normalizeTierScope } from '../script-includes/deal-type-normalizer.js'

export function validatePlanTierConfiguration(current, previous) {
    var floor = parseFloat(current.getValue('attainment_floor_percent')) || 0;
    var ceilingRaw = parseFloat(current.getValue('attainment_ceiling_percent'));
    var hasCeiling = !isNaN(ceilingRaw) && ceilingRaw > 0;
    var ceiling = hasCeiling ? ceilingRaw : null;
    var rate = parseFloat(current.getValue('commission_rate_percent')) || 0;
    var dealType = normalizeDealType(current.getValue('deal_type'));

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

    if (!isAllowedDealType(dealType)) {
        gs.addErrorMessage('Tier deal type scope must be one of: all, new_business/seller_sourced, renewal/referral, expansion, upsell');
        current.setAbortAction(true);
        return;
    }

    // Only enforce overlap validation for active tiers.
    if (current.getValue('is_active') === 'false') {
        return;
    }

    var overlapGr = new GlideRecord('x_823178_commissio_plan_tiers');
    overlapGr.addQuery('commission_plan', current.getValue('commission_plan'));
    overlapGr.addQuery('is_active', true);
    overlapGr.addQuery('sys_id', '!=', current.sys_id);
    overlapGr.query();

    while (overlapGr.next()) {
        var otherDealType = normalizeDealType(overlapGr.getValue('deal_type'));
        if (!scopeOverlaps(dealType, otherDealType)) {
            continue;
        }

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

    if (!validateContiguousCoverage(current, dealType, floor, ceiling)) {
        current.setAbortAction(true);
        return;
    }
}

function normalizeDealType(value) {
    return normalizeTierScope(value);
}

function isAllowedDealType(dealType) {
    return dealType === 'all' ||
        dealType === 'new_business' ||
        dealType === 'renewal' ||
        dealType === 'expansion' ||
        dealType === 'upsell';
}

function scopeOverlaps(left, right) {
    return left === 'all' || right === 'all' || left === right;
}

function tierRangeOverlaps(leftFloor, leftCeiling, rightFloor, rightCeiling) {
    var leftHigh = leftCeiling === null ? Number.POSITIVE_INFINITY : leftCeiling;
    var rightHigh = rightCeiling === null ? Number.POSITIVE_INFINITY : rightCeiling;

    // Half-open interval overlap: [floor, ceiling)
    return leftFloor < rightHigh && rightFloor < leftHigh;
}

function validateContiguousCoverage(current, dealType, currentFloor, currentCeiling) {
    var ranges = [];

    var tierGr = new GlideRecord('x_823178_commissio_plan_tiers');
    tierGr.addQuery('commission_plan', current.getValue('commission_plan'));
    tierGr.addQuery('is_active', true);
    tierGr.addQuery('sys_id', '!=', current.sys_id);
    tierGr.query();

    while (tierGr.next()) {
        var scope = normalizeDealType(tierGr.getValue('deal_type'));
        if (scope !== dealType) {
            continue;
        }

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
