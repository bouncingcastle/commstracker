import { gs, GlideRecord, GlideDateTime } from '@servicenow/glide'

export function processBulkPlanAssignmentRun(current, previous) {
    if (!current.getValue('source_plan')) {
        gs.addErrorMessage('Source plan is required for bulk assignment run.');
        current.setAbortAction(true);
        return;
    }

    var mode = (current.getValue('mode') || 'preview').toString();
    if (!shouldExecute(current, previous, mode)) {
        return;
    }

    var sourcePlan = getSourcePlan(current.getValue('source_plan'));
    if (!sourcePlan) {
        gs.addErrorMessage('Source plan record is invalid or unavailable.');
        current.setAbortAction(true);
        return;
    }

    var targetUsers = parseTargetUsers(current.getValue('target_user_ids'));
    if (targetUsers.length === 0 && mode !== 'rollback') {
        gs.addErrorMessage('At least one valid target user sys_id is required for preview/apply.');
        current.setAbortAction(true);
        return;
    }

    var effectiveStart = current.getValue('override_effective_start_date') || sourcePlan.effectiveStartDate;
    var effectiveEnd = current.getValue('override_effective_end_date') || sourcePlan.effectiveEndDate;

    if (effectiveEnd && effectiveStart && isDateBefore(effectiveEnd, effectiveStart)) {
        gs.addErrorMessage('Override effective end date must be on or after effective start date.');
        current.setAbortAction(true);
        return;
    }

    if (mode === 'preview') {
        runPreview(current, targetUsers, effectiveStart, effectiveEnd);
        return;
    }

    if (mode === 'apply') {
        runApply(current, sourcePlan, targetUsers, effectiveStart, effectiveEnd);
        return;
    }

    if (mode === 'rollback') {
        runRollback(current);
        return;
    }

    gs.addErrorMessage('Unsupported bulk assignment mode: ' + mode);
    current.setAbortAction(true);
}

function runPreview(current, users, effectiveStart, effectiveEnd) {
    var summary = {
        totalTargets: users.length,
        validTargets: 0,
        overlapSkipped: 0,
        invalidUsers: 0,
        effectiveStartDate: effectiveStart || '',
        effectiveEndDate: effectiveEnd || ''
    };

    for (var i = 0; i < users.length; i++) {
        var userId = users[i];
        if (!isActiveUser(userId)) {
            summary.invalidUsers++;
            continue;
        }

        if (hasOverlappingPlan(userId, effectiveStart, effectiveEnd, '')) {
            summary.overlapSkipped++;
            continue;
        }

        summary.validTargets++;
    }

    current.setValue('dry_run', true);
    current.setValue('status', 'previewed');
    current.setValue('preview_summary', compactJson(summary));
    current.setValue('execution_summary', '');
    current.setValue('rollback_summary', '');
    stampExecution(current);
}

function runApply(current, sourcePlan, users, effectiveStart, effectiveEnd) {
    var result = {
        totalTargets: users.length,
        createdPlans: 0,
        overlapSkipped: 0,
        invalidUsers: 0,
        errors: 0,
        effectiveStartDate: effectiveStart || '',
        effectiveEndDate: effectiveEnd || ''
    };

    var createdIds = [];
    for (var i = 0; i < users.length; i++) {
        var userId = users[i];
        if (!isActiveUser(userId)) {
            result.invalidUsers++;
            continue;
        }

        if (hasOverlappingPlan(userId, effectiveStart, effectiveEnd, '')) {
            result.overlapSkipped++;
            continue;
        }

        var newPlanId = clonePlanForUser(sourcePlan, userId, effectiveStart, effectiveEnd);
        if (newPlanId) {
            createdIds.push(newPlanId);
            result.createdPlans++;
        } else {
            result.errors++;
        }
    }

    current.setValue('dry_run', false);
    current.setValue('status', result.errors > 0 ? 'error' : 'applied');
    current.setValue('created_plan_ids', createdIds.join(','));
    current.setValue('execution_summary', compactJson(result));
    if (result.createdPlans === 0 && result.errors === 0) {
        gs.addInfoMessage('Bulk assignment apply completed with no plan creations (all targets skipped or invalid).');
    }
    stampExecution(current);
}

function runRollback(current) {
    var createdPlanIdsRaw = (current.getValue('created_plan_ids') || '').toString();
    if (!createdPlanIdsRaw) {
        gs.addErrorMessage('No created plan IDs available to rollback. Run apply first.');
        current.setAbortAction(true);
        return;
    }

    var ids = parseTargetUsers(createdPlanIdsRaw);
    var result = {
        requested: ids.length,
        deactivated: 0,
        alreadyInactive: 0,
        missing: 0
    };

    for (var i = 0; i < ids.length; i++) {
        var planId = ids[i];
        var planGr = new GlideRecord('x_823178_commissio_commission_plans');
        if (!planGr.get(planId)) {
            result.missing++;
            continue;
        }

        if (toBool(planGr.getValue('is_active'))) {
            planGr.setValue('is_active', false);
            planGr.update();
            result.deactivated++;
        } else {
            result.alreadyInactive++;
        }
    }

    current.setValue('status', 'rolled_back');
    current.setValue('rollback_summary', compactJson(result));
    stampExecution(current);
}

function clonePlanForUser(sourcePlan, userId, effectiveStart, effectiveEnd) {
    try {
        var planGr = new GlideRecord('x_823178_commissio_commission_plans');
        planGr.initialize();
        planGr.setValue('plan_name', sourcePlan.planName + ' - Bulk Assignment');
        planGr.setValue('sales_rep', userId);
        planGr.setValue('effective_start_date', effectiveStart || sourcePlan.effectiveStartDate);
        if (effectiveEnd || sourcePlan.effectiveEndDate) {
            planGr.setValue('effective_end_date', effectiveEnd || sourcePlan.effectiveEndDate);
        }
        planGr.setValue('is_active', true);
        planGr.setValue('description', appendBulkDescription(sourcePlan.description));
        var newPlanId = planGr.insert();
        if (!newPlanId) {
            return '';
        }

        clonePlanHierarchy(sourcePlan.planId, newPlanId);
        return newPlanId;
    } catch (e) {
        gs.error('Commission Management: Failed to clone plan for user ' + userId + ' - ' + e.message);
        return '';
    }
}

function appendBulkDescription(sourceDescription) {
    var base = (sourceDescription || '').toString();
    var suffix = ' [Bulk Assignment Clone]';
    if (!base) {
        return 'Bulk assignment clone plan';
    }
    if (base.indexOf(suffix) > -1) {
        return base;
    }
    return base + suffix;
}

function clonePlanHierarchy(sourcePlanId, targetPlanId) {
    var targetMap = clonePlanTargets(sourcePlanId, targetPlanId);
    clonePlanTiers(sourcePlanId, targetPlanId, targetMap);
    clonePlanBonuses(sourcePlanId, targetPlanId);
}

function clonePlanTargets(sourcePlanId, targetPlanId) {
    var map = {};
    var targetGr = new GlideRecord('x_823178_commissio_plan_targets');
    targetGr.addQuery('commission_plan', sourcePlanId);
    targetGr.query();

    while (targetGr.next()) {
        var newTargetGr = new GlideRecord('x_823178_commissio_plan_targets');
        newTargetGr.initialize();
        newTargetGr.setValue('commission_plan', targetPlanId);
        newTargetGr.setValue('deal_type_ref', targetGr.getValue('deal_type_ref'));
        newTargetGr.setValue('commission_rate_percent', targetGr.getValue('commission_rate_percent'));
        newTargetGr.setValue('annual_target_amount', targetGr.getValue('annual_target_amount'));
        newTargetGr.setValue('is_active', targetGr.getValue('is_active'));
        newTargetGr.setValue('description', targetGr.getValue('description'));
        var newTargetId = newTargetGr.insert();
        if (newTargetId) {
            map[targetGr.getUniqueValue()] = newTargetId;
        }
    }

    return map;
}

function clonePlanTiers(sourcePlanId, targetPlanId, targetMap) {
    var tierGr = new GlideRecord('x_823178_commissio_plan_tiers');
    tierGr.addQuery('commission_plan', sourcePlanId);
    tierGr.query();

    while (tierGr.next()) {
        var sourceTargetId = (tierGr.getValue('plan_target') || '').toString();
        var mappedTargetId = targetMap[sourceTargetId] || '';
        if (!mappedTargetId) {
            continue;
        }

        var newTierGr = new GlideRecord('x_823178_commissio_plan_tiers');
        newTierGr.initialize();
        newTierGr.setValue('commission_plan', targetPlanId);
        newTierGr.setValue('plan_target', mappedTargetId);
        newTierGr.setValue('tier_name', tierGr.getValue('tier_name'));
        newTierGr.setValue('attainment_floor_percent', tierGr.getValue('attainment_floor_percent'));
        newTierGr.setValue('attainment_ceiling_percent', tierGr.getValue('attainment_ceiling_percent'));
        newTierGr.setValue('commission_rate_percent', tierGr.getValue('commission_rate_percent'));
        newTierGr.setValue('sort_order', tierGr.getValue('sort_order'));
        newTierGr.setValue('is_active', tierGr.getValue('is_active'));
        newTierGr.setValue('description', tierGr.getValue('description'));
        newTierGr.insert();
    }
}

function clonePlanBonuses(sourcePlanId, targetPlanId) {
    var bonusGr = new GlideRecord('x_823178_commissio_plan_bonuses');
    bonusGr.addQuery('commission_plan', sourcePlanId);
    bonusGr.query();

    while (bonusGr.next()) {
        var newBonusGr = new GlideRecord('x_823178_commissio_plan_bonuses');
        newBonusGr.initialize();
        newBonusGr.setValue('commission_plan', targetPlanId);
        newBonusGr.setValue('bonus_name', bonusGr.getValue('bonus_name'));
        newBonusGr.setValue('bonus_amount', bonusGr.getValue('bonus_amount'));
        newBonusGr.setValue('qualification_metric', bonusGr.getValue('qualification_metric'));
        newBonusGr.setValue('qualification_operator', bonusGr.getValue('qualification_operator'));
        newBonusGr.setValue('qualification_threshold', bonusGr.getValue('qualification_threshold'));
        newBonusGr.setValue('evaluation_period', bonusGr.getValue('evaluation_period'));
        newBonusGr.setValue('one_time_per_period', bonusGr.getValue('one_time_per_period'));
        newBonusGr.setValue('deal_type_ref', bonusGr.getValue('deal_type_ref'));
        newBonusGr.setValue('is_discretionary', bonusGr.getValue('is_discretionary'));
        newBonusGr.setValue('payout_frequency', bonusGr.getValue('payout_frequency'));
        newBonusGr.setValue('auto_payout', bonusGr.getValue('auto_payout'));
        newBonusGr.setValue('is_active', bonusGr.getValue('is_active'));
        newBonusGr.setValue('description', bonusGr.getValue('description'));
        newBonusGr.insert();
    }
}

function hasOverlappingPlan(userId, startDate, endDate, excludePlanId) {
    var overlapGr = new GlideRecord('x_823178_commissio_commission_plans');
    overlapGr.addQuery('sales_rep', userId);
    overlapGr.addQuery('is_active', true);
    if (excludePlanId) {
        overlapGr.addQuery('sys_id', '!=', excludePlanId);
    }
    overlapGr.query();

    while (overlapGr.next()) {
        var existingStart = overlapGr.getValue('effective_start_date');
        var existingEnd = overlapGr.getValue('effective_end_date');
        if (rangesOverlap(startDate, endDate, existingStart, existingEnd)) {
            return true;
        }
    }
    return false;
}

function rangesOverlap(startA, endA, startB, endB) {
    var aStart = toSortableDate(startA);
    var aEnd = toSortableDate(endA || '9999-12-31');
    var bStart = toSortableDate(startB);
    var bEnd = toSortableDate(endB || '9999-12-31');

    return aStart <= bEnd && bStart <= aEnd;
}

function toSortableDate(value) {
    return (value || '').toString().substring(0, 10);
}

function isDateBefore(a, b) {
    return toSortableDate(a) < toSortableDate(b);
}

function isActiveUser(userId) {
    var userGr = new GlideRecord('sys_user');
    if (!userGr.get(userId)) {
        return false;
    }
    return toBool(userGr.getValue('active'));
}

function getSourcePlan(planId) {
    var gr = new GlideRecord('x_823178_commissio_commission_plans');
    if (!gr.get(planId)) {
        return null;
    }

    return {
        planId: gr.getUniqueValue(),
        planName: gr.getValue('plan_name') || 'Commission Plan',
        effectiveStartDate: gr.getValue('effective_start_date'),
        effectiveEndDate: gr.getValue('effective_end_date'),
        description: gr.getValue('description')
    };
}

function stampExecution(current) {
    current.setValue('executed_by', gs.getUserID());
    current.setValue('executed_on', new GlideDateTime().getDisplayValue());
}

function shouldExecute(current, previous, mode) {
    if (!previous || !previous.sys_id) {
        return true;
    }

    var previousMode = (previous.getValue('mode') || '').toString();
    var previousStatus = (previous.getValue('status') || '').toString();
    var currentStatus = (current.getValue('status') || '').toString();

    if (previousMode !== mode) {
        return true;
    }

    if (currentStatus === 'draft' && previousStatus !== 'draft') {
        return true;
    }

    if (mode === 'preview' && previousStatus !== 'previewed') {
        return true;
    }

    if (mode === 'apply' && previousStatus !== 'applied') {
        return true;
    }

    if (mode === 'rollback' && previousStatus !== 'rolled_back') {
        return true;
    }

    return false;
}

function parseTargetUsers(rawIds) {
    var value = (rawIds || '').toString();
    if (!value) {
        return [];
    }

    var split = value.split(',');
    var unique = {};
    var result = [];

    for (var i = 0; i < split.length; i++) {
        var id = (split[i] || '').toString().trim();
        if (!id || unique[id]) {
            continue;
        }
        unique[id] = true;
        result.push(id);
    }

    return result;
}

function compactJson(obj) {
    var text = JSON.stringify(obj || {});
    if (!text) {
        return '{}';
    }
    if (text.length > 3990) {
        return text.substring(0, 3990);
    }
    return text;
}

function toBool(value) {
    return value === true || value === 'true' || value === '1' || value === 1;
}
