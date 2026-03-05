import { gs } from '@servicenow/glide'
import { normalizeBonusScope } from '../script-includes/deal-type-normalizer.js'

export function validatePlanBonusConfiguration(current, previous) {
    if (!current.getValue('commission_plan')) {
        gs.addErrorMessage('Commission plan is required for bonus configuration.');
        current.setAbortAction(true);
        return;
    }

    var amount = parseFloat(current.getValue('bonus_amount')) || 0;
    if (amount <= 0) {
        gs.addErrorMessage('Bonus amount must be greater than zero.');
        current.setAbortAction(true);
        return;
    }

    var metric = normalizeMetric(current.getValue('qualification_metric'));
    if (!isSupportedMetric(metric)) {
        gs.addErrorMessage('Qualification metric must be one of: quota_attainment_percent, deal_amount, deal_count, base_commission_amount.');
        current.setAbortAction(true);
        return;
    }

    var operator = normalizeOperator(current.getValue('qualification_operator'));
    if (!isSupportedOperator(operator)) {
        gs.addErrorMessage('Qualification operator must be one of: gte, gt, eq.');
        current.setAbortAction(true);
        return;
    }

    var threshold = parseFloat(current.getValue('qualification_threshold'));
    if (isNaN(threshold) || threshold < 0) {
        gs.addErrorMessage('Qualification threshold must be zero or greater.');
        current.setAbortAction(true);
        return;
    }

    if (metric === 'deal_count' && Math.floor(threshold) !== threshold) {
        gs.addErrorMessage('Deal count threshold must be a whole number.');
        current.setAbortAction(true);
        return;
    }

    var period = normalizePeriod(current.getValue('evaluation_period'));
    if (!isSupportedPeriod(period)) {
        gs.addErrorMessage('Evaluation period must be one of: calculation, monthly, quarterly, annual.');
        current.setAbortAction(true);
        return;
    }

    var oneTime = current.getValue('one_time_per_period') === 'true' || current.getValue('one_time_per_period') === true;
    if (oneTime && period === 'calculation') {
        gs.addErrorMessage('One-time per period bonuses require monthly, quarterly, or annual evaluation period.');
        current.setAbortAction(true);
        return;
    }

    var dealType = normalizeDealType(current.getValue('deal_type'));
    if (!isSupportedDealType(dealType)) {
        gs.addErrorMessage('Deal type scope must be one of: any, new_business, renewal, expansion, upsell.');
        current.setAbortAction(true);
        return;
    }

    current.setValue('qualification_metric', metric);
    current.setValue('qualification_operator', operator);
    current.setValue('evaluation_period', period);
    current.setValue('deal_type', dealType);

    var summary = buildConditionSummary(metric, operator, threshold, period, dealType, oneTime);
    current.setValue('condition_summary', summary);

    if (!current.getValue('bonus_trigger')) {
        current.setValue('bonus_trigger', summary);
    }
}

function normalizeMetric(value) {
    return (value || '').toString().trim() || 'quota_attainment_percent';
}

function normalizeOperator(value) {
    return (value || '').toString().trim() || 'gte';
}

function normalizePeriod(value) {
    return (value || '').toString().trim() || 'calculation';
}

function normalizeDealType(value) {
    return normalizeBonusScope(value);
}

function isSupportedMetric(metric) {
    return metric === 'quota_attainment_percent' ||
        metric === 'deal_amount' ||
        metric === 'deal_count' ||
        metric === 'base_commission_amount';
}

function isSupportedOperator(operator) {
    return operator === 'gte' || operator === 'gt' || operator === 'eq';
}

function isSupportedPeriod(period) {
    return period === 'calculation' || period === 'monthly' || period === 'quarterly' || period === 'annual';
}

function isSupportedDealType(dealType) {
    return dealType === 'any' ||
        dealType === 'new_business' ||
        dealType === 'renewal' ||
        dealType === 'expansion' ||
        dealType === 'upsell';
}

function buildConditionSummary(metric, operator, threshold, period, dealType, oneTime) {
    var metricLabel = {
        quota_attainment_percent: 'Quota attainment %',
        deal_amount: 'Deal amount',
        deal_count: 'Deal count',
        base_commission_amount: 'Base commission amount'
    }[metric] || metric;

    var operatorLabel = {
        gte: '>=',
        gt: '>',
        eq: '='
    }[operator] || operator;

    var scopeLabel = (dealType || 'any').replace(/_/g, ' ');
    var periodLabel = (period || 'calculation').replace(/_/g, ' ');

    var parts = [metricLabel + ' ' + operatorLabel + ' ' + threshold, 'scope: ' + scopeLabel, 'period: ' + periodLabel];
    if (oneTime) {
        parts.push('one-time per period');
    }

    return parts.join(' | ');
}
