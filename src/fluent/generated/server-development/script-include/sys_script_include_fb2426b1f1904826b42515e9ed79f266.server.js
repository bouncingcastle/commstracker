
var CommissionProgressHelper = Class.create();
CommissionProgressHelper.prototype = Object.extendsObject(AbstractAjaxProcessor, {
    
    getRepProgress: function() {
        var userId = this.getParameter('sysparm_user_id') || this.getParameter('user_id');
        
        if (!userId) {
            return this.getErrorJSON('No user ID provided');
        }

        try {
            var result = {
                status: 'success',
                data: {
                    total_earned: 0,
                    pending_amount: 0,
                    pending_count: 0,
                    paid_amount: 0,
                    paid_count: 0,
                    active_deals_count: 0,
                    pipeline_value: 0,
                    breakdown: {},
                    deal_breakdown: {},
                    recent_calculations: [],
                    active_deals: [],
                    active_plan: null
                }
            };

            var today = new GlideDateTime();
            var currentYear = today.getYearLocalTime();
            var yearStart = currentYear + '-01-01';
            var yearEnd = currentYear + '-12-31';

            var planId = '';
            var planGr = new GlideRecord('x_823178_commissio_commission_plans');
            planGr.addQuery('sales_rep', userId);
            planGr.addQuery('is_active', true);
            planGr.addQuery('effective_start_date', '<=', today.getDisplayValue());
            planGr.addQuery('effective_end_date', '>=', today.getDisplayValue());
            planGr.orderBy('effective_start_date');
            planGr.query();

            if (planGr.next()) {
                var planYearStr = planGr.getValue('effective_start_date');
                var planYear = planYearStr ? new GlideDateTime(planYearStr).getYearLocalTime() : currentYear;
                planId = planGr.getValue('sys_id');
                
                var compDetails = this.getCompensationPlanDetails(planId);
                var baseRate = compDetails.base_rate;
                var totalQuota = compDetails.total_quota;
                var oTE100 = totalQuota > 0 ? (totalQuota * baseRate / 100) : 0;
                var oteWithBonuses = oTE100 + compDetails.total_bonus_potential;
                
                result.data.active_plan = {
                    plan_name: planGr.getValue('plan_name'),
                    plan_target_amount: planGr.getValue('plan_target_amount'),
                    plan_year: planYear,
                    sys_id: planId,
                    effective_start_date: planGr.getValue('effective_start_date'),
                    effective_end_date: planGr.getValue('effective_end_date'),
                    targets: compDetails.targets,
                    tiers: compDetails.tiers,
                    bonuses: compDetails.bonuses,
                    total_quota: compDetails.total_quota,
                    base_rate: baseRate,
                    ote_at_100_percent: oTE100,
                    ote_with_bonuses: oteWithBonuses,
                    total_bonus_potential: compDetails.total_bonus_potential
                };
            }

            var calcGr = new GlideRecord('x_823178_commissio_commission_calculations');
            calcGr.addQuery('sales_rep', userId);
            calcGr.addQuery('calculation_date', '>=', yearStart);
            calcGr.addQuery('calculation_date', '<=', yearEnd);
            calcGr.orderBy('-calculation_date');
            calcGr.query();

            var totalEarned = 0;
            var pendingAmount = 0;
            var pendingCount = 0;
            var paidAmount = 0;
            var paidCount = 0;
            var breakdown = { 'new_business': 0, 'renewal': 0, 'expansion': 0, 'upsell': 0, 'other': 0 };
            var recentCalcs = [];
            var calcCount = 0;

            while (calcGr.next() && calcCount < 50) {
                var commAmount = parseFloat(calcGr.getValue('commission_amount')) || 0;
                var status = calcGr.getValue('status') || 'draft';
                var dealType = calcGr.getValue('deal_type') || 'other';

                if (status === 'paid' || status === 'locked') {
                    paidAmount += commAmount;
                    paidCount++;
                } else if (status === 'draft') {
                    pendingAmount += commAmount;
                    pendingCount++;
                }
                totalEarned += commAmount;

                if (breakdown.hasOwnProperty(dealType)) {
                    breakdown[dealType] += commAmount;
                } else {
                    breakdown.other += commAmount;
                }

                if (recentCalcs.length < 10) {
                    var calcDealGr = new GlideRecord('x_823178_commissio_deals');
                    calcDealGr.get(calcGr.getValue('deal'));
                    
                    recentCalcs.push({
                        deal_name: calcDealGr.getDisplayValue('deal_name'),
                        deal_type: calcGr.getValue('deal_type'),
                        commission_base_amount: calcGr.getValue('commission_base_amount'),
                        commission_rate: calcGr.getValue('commission_rate'),
                        commission_amount: calcGr.getValue('commission_amount'),
                        payment_date: calcGr.getValue('payment_date'),
                        status: status
                    });
                }
                calcCount++;
            }

            result.data.total_earned = totalEarned;
            result.data.pending_amount = pendingAmount;
            result.data.pending_count = pendingCount;
            result.data.paid_amount = paidAmount;
            result.data.paid_count = paidCount;
            result.data.breakdown = breakdown;
            result.data.recent_calculations = recentCalcs;

            var dealGr = new GlideRecord('x_823178_commissio_deals');
            dealGr.addQuery('current_owner', userId);
            dealGr.addQuery('is_won', false);
            dealGr.addQuery('stage', '!=', 'closed_lost');
            dealGr.orderBy('close_date');
            dealGr.query();

            var activeDeals = [];
            var pipelineValue = 0;
            var dealBreakdown = { 'new_business': 0, 'renewal': 0, 'expansion': 0, 'upsell': 0, 'other': 0 };
            var dealCount = 0;

            while (dealGr.next() && dealCount < 50) {
                var dealAmount = parseFloat(dealGr.getValue('amount')) || 0;
                var dealType2 = dealGr.getValue('deal_type') || 'other';

                pipelineValue += dealAmount;

                if (dealBreakdown.hasOwnProperty(dealType2)) {
                    dealBreakdown[dealType2] += dealAmount;
                } else {
                    dealBreakdown.other += dealAmount;
                }

                if (activeDeals.length < 20) {
                    activeDeals.push({
                        deal_name: dealGr.getValue('deal_name'),
                        account_name: dealGr.getValue('account_name'),
                        amount: dealAmount,
                        deal_type: dealType2,
                        stage: dealGr.getValue('stage'),
                        close_date: dealGr.getValue('close_date')
                    });
                }
                dealCount++;
            }

            result.data.active_deals_count = dealCount;
            result.data.pipeline_value = pipelineValue;
            result.data.deal_breakdown = dealBreakdown;
            result.data.active_deals = activeDeals;

            if (planId) {
                try {
                    result.data.quota_progress = this.getQuotaProgress(userId, planId);
                } catch (quotaErr) {
                    gs.log('CommissionProgressHelper quota fetch warning: ' + quotaErr.getMessage(), 'CommissionProgressHelper');
                }
            }

            return JSON.stringify(result);

        } catch (e) {
            gs.error('CommissionProgressHelper.getRepProgress error: ' + e.getMessage());
            return this.getErrorJSON('Error fetching commission progress: ' + e.getMessage());
        }
    },

    getQuotaProgress: function(userId, planId) {
        try {
            var progress = {};

            var targetGr = new GlideRecord('x_823178_commissio_plan_targets');
            targetGr.addQuery('commission_plan', planId);
            targetGr.query();

            var targets = {};
            while (targetGr.next()) {
                var dt = targetGr.getValue('deal_type');
                targets[dt] = parseFloat(targetGr.getValue('annual_target_amount')) || 0;
            }

            var today = new GlideDateTime();
            var currentYear = today.getYearLocalTime();
            var yearStart = currentYear + '-01-01';
            var yearEnd = currentYear + '-12-31';

            var dealGr = new GlideRecord('x_823178_commissio_deals');
            dealGr.addQuery('current_owner', userId);
            dealGr.addQuery('is_won', true);
            dealGr.addQuery('close_date', '>=', yearStart);
            dealGr.addQuery('close_date', '<=', yearEnd);
            dealGr.query();

            var achieved = {};
            while (dealGr.next()) {
                var dt2 = dealGr.getValue('deal_type') || 'other';
                var amount = parseFloat(dealGr.getValue('amount')) || 0;
                if (!achieved[dt2]) achieved[dt2] = 0;
                achieved[dt2] += amount;
            }

            Object.keys(targets).forEach(function(dealType) {
                var target = targets[dealType];
                var achievedAmount = achieved[dealType] || 0;
                var attainment = target > 0 ? (achievedAmount / target) * 100 : 0;
                progress[dealType] = {
                    target_amount: target,
                    achieved_amount: achievedAmount,
                    remaining_amount: Math.max(target - achievedAmount, 0),
                    attainment_percent: Math.min(attainment, 100),
                    is_over_quota: achievedAmount >= target
                };
            });

            return progress;
        } catch (e) {
            gs.error('CommissionProgressHelper.getQuotaProgress error: ' + e.getMessage());
            return {};
        }
    },

    getCurrentUser: function() {
        try {
            return JSON.stringify({
                status: 'success',
                data: {
                    user_id: gs.getUserID(),
                    user_name: gs.getUserDisplayName()
                }
            });
        } catch (e) {
            gs.error('CommissionProgressHelper.getCurrentUser error: ' + e.getMessage());
            return this.getErrorJSON('Unable to resolve current user: ' + e.getMessage());
        }
    },

    searchUsers: function() {
        var searchTerm = this.getParameter('sysparm_search_term') || this.getParameter('search_term') || '';

        if (!searchTerm || searchTerm.length < 2) {
            return this.getErrorJSON('Search term must be at least 2 characters');
        }

        try {
            var userGr = new GlideRecord('sys_user');
            userGr.addActiveQuery();

            if (searchTerm.length === 32) {
                userGr.addQuery('sys_id', searchTerm);
                userGr.query();
                if (userGr.next()) {
                    return JSON.stringify({
                        status: 'success',
                        data: {
                            user_id: userGr.getUniqueValue(),
                            user_name: userGr.getDisplayValue('name')
                        }
                    });
                }
            }

            var qc = userGr.addQuery('name', 'LIKE', searchTerm);
            qc.addOrCondition('first_name', 'LIKE', searchTerm);
            qc.addOrCondition('last_name', 'LIKE', searchTerm);
            userGr.setLimit(1);
            userGr.query();

            if (userGr.next()) {
                return JSON.stringify({
                    status: 'success',
                    data: {
                        user_id: userGr.getUniqueValue(),
                        user_name: userGr.getDisplayValue('name')
                    }
                });
            }

            return this.getErrorJSON('No user found matching: ' + searchTerm);
        } catch (e) {
            gs.error('CommissionProgressHelper.searchUsers error: ' + e.getMessage());
            return this.getErrorJSON('Error searching users: ' + e.getMessage());
        }
    },

    getCompensationPlanDetails: function(planId) {
        try {
            var details = {
                targets: {},
                tiers: [],
                bonuses: [],
                total_quota: 0,
                base_rate: 0,
                total_bonus_potential: 0
            };

            if (!planId) return details;

            var targetGr = new GlideRecord('x_823178_commissio_plan_targets');
            targetGr.addQuery('commission_plan', planId);
            targetGr.orderBy('deal_type');
            targetGr.query();

            while (targetGr.next()) {
                var dealType = targetGr.getValue('deal_type');
                var amount = parseFloat(targetGr.getValue('annual_target_amount')) || 0;
                details.total_quota += amount;
                details.targets[dealType] = amount;
            }

            var tierGr = new GlideRecord('x_823178_commissio_plan_tiers');
            tierGr.addQuery('commission_plan', planId);
            tierGr.orderBy('attainment_floor_percent');
            tierGr.query();

            while (tierGr.next()) {
                var floor = parseFloat(tierGr.getValue('attainment_floor_percent')) || 0;
                var rate = parseFloat(tierGr.getValue('commission_rate_percent')) || 0;
                if (floor === 0) details.base_rate = rate;
                details.tiers.push({
                    tier_name: tierGr.getValue('tier_name'),
                    floor_percent: floor,
                    rate_percent: rate
                });
            }

            var bonusGr = new GlideRecord('x_823178_commissio_plan_bonuses');
            bonusGr.addQuery('commission_plan', planId);
            bonusGr.addQuery('is_active', true);
            bonusGr.orderBy('bonus_name');
            bonusGr.query();

            while (bonusGr.next()) {
                var bonusAmount = parseFloat(bonusGr.getValue('bonus_amount')) || 0;
                details.total_bonus_potential += bonusAmount;
                details.bonuses.push({
                    name: bonusGr.getValue('bonus_name'),
                    amount: bonusAmount,
                    trigger: bonusGr.getValue('bonus_trigger'),
                    deal_type: bonusGr.getValue('deal_type'),
                    is_discretionary: bonusGr.getValue('is_discretionary') === '1' || bonusGr.getValue('is_discretionary') === true
                });
            }

            return details;
        } catch (e) {
            gs.error('CommissionProgressHelper.getCompensationPlanDetails error: ' + e.getMessage());
            return { targets: {}, tiers: [], bonuses: [], total_quota: 0, base_rate: 0, total_bonus_potential: 0 };
        }
    },

    getErrorJSON: function(msg) {
        return JSON.stringify({
            status: 'error',
            message: msg
        });
    },

    type: 'CommissionProgressHelper'
});
        