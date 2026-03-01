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
        planGr.setValue('new_business_rate', sourcePlan.newBusinessRate);
        planGr.setValue('renewal_rate', sourcePlan.renewalRate);
        planGr.setValue('expansion_rate', sourcePlan.expansionRate);
        planGr.setValue('upsell_rate', sourcePlan.upsellRate);
        planGr.setValue('base_rate', sourcePlan.baseRate);
        if (sourcePlan.planTargetAmount) {
            planGr.setValue('plan_target_amount', sourcePlan.planTargetAmount);
        }
        planGr.setValue('description', appendBulkDescription(sourcePlan.description));
        return planGr.insert();
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
        newBusinessRate: gr.getValue('new_business_rate'),
        renewalRate: gr.getValue('renewal_rate'),
        expansionRate: gr.getValue('expansion_rate'),
        upsellRate: gr.getValue('upsell_rate'),
        baseRate: gr.getValue('base_rate'),
        planTargetAmount: gr.getValue('plan_target_amount'),
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
