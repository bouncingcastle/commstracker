// Script Include: CommissionProgressHelper
// Provides AJAX data aggregation for sales rep commission progress view

var CommissionProgressHelper = Class.create();
CommissionProgressHelper.prototype = Object.extendsObject(AbstractAjaxProcessor, {
    
    getRepProgress: function() {
        var userId = this.getParameter('sysparm_name') === 'getRepProgress' ? this.getParameter('user_id') : null;
        
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

            // Get current date
            var today = new GlideDateTime();
            var currentYear = today.getYearLocalTime();
            
            // Build year range for filtering
            var yearStart = currentYear + '-01-01';
            var yearEnd = currentYear + '-12-31';

            // Get active commission plan for this rep (current year)
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
                var planId = planGr.getValue('sys_id');
                
                // Fetch compensation plan details (targets, tiers, bonuses)
                var compDetails = this.getCompensationPlanDetails(planId);
                
                // Calculate OTE
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

            // Fetch commission calculations for this rep (current year)
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
            var breakdown = { 'New Business': 0, 'Renewal': 0, 'Expansion': 0, 'Upsell': 0, 'Other': 0 };
            var recentCalcs = [];
            var calcCount = 0;

            while (calcGr.next() && calcCount < 10) {
                var commAmount = parseFloat(calcGr.getValue('commission_amount')) || 0;
                var status = calcGr.getValue('status') || 'draft';
                var dealType = calcGr.getValue('deal_type') || 'other';

                // Accumulate totals
                if (status === 'paid' || status === 'locked') {
                    paidAmount += commAmount;
                    paidCount++;
                } else if (status === 'draft') {
                    pendingAmount += commAmount;
                    pendingCount++;
                }
                totalEarned += commAmount;

                // Breakdown by deal type (keys must match exactly)
                if (breakdown.hasOwnProperty(dealType)) {
                    breakdown[dealType] += commAmount;
                } else {
                    breakdown['Other'] += commAmount;
                }

                // Recent calculations (for table)
                if (recentCalcs.length < 10) {
                    var dealGr = new GlideRecord('x_823178_commissio_deals');
                    dealGr.get(calcGr.getValue('deal'));
                    
                    recentCalcs.push({
                        deal_name: dealGr.getDisplayValue('deal_name'),
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

            // Fetch active deals for this rep (current owner, not won/lost)
            var dealGr = new GlideRecord('x_823178_commissio_deals');
            dealGr.addQuery('current_owner', userId);
            dealGr.addQuery('is_won', false);
            dealGr.addQuery('stage', '!=', 'closed_lost');
            dealGr.orderBy('close_date');
            dealGr.query();

            var activeDeals = [];
            var pipelineValue = 0;
            var dealBreakdown = { 'New Business': 0, 'Renewal': 0, 'Expansion': 0, 'Upsell': 0, 'Other': 0 };
            var dealCount = 0;

            while (dealGr.next() && dealCount < 50) {
                var dealAmount = parseFloat(dealGr.getValue('amount')) || 0;
                var dealType = dealGr.getValue('deal_type') || 'other';

                pipelineValue += dealAmount;

                if (dealBreakdown.hasOwnProperty(dealType)) {
                    dealBreakdown[dealType] += dealAmount;
                } else {
                    dealBreakdown['Other'] += dealAmount;
                }

                // Active deals table (first 20)
                if (activeDeals.length < 20) {
                    activeDeals.push({
                        deal_name: dealGr.getValue('deal_name'),
                        account_name: dealGr.getValue('account_name'),
                        amount: dealAmount,
                        deal_type: dealType,
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

            // Fetch quota progress by deal type if compensation data available
            if (planId) {
                try {
                    var quotaProgress = this.getQuotaProgress(userId, planId);
                    result.data.quota_progress = quotaProgress;
                } catch (e) {
                    gs.log('Commission-progress-helper: Could not fetch quota progress: ' + e.getMessage(), 'CommissionProgressHelper');
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

            // Fetch plan targets
            var targetGr = new GlideRecord('x_823178_commissio_plan_targets');
            targetGr.addQuery('commission_plan', planId);
            targetGr.query();

            var targets = {};
            while (targetGr.next()) {
                var dealType = targetGr.getValue('deal_type');
                var target = parseFloat(targetGr.getValue('annual_target_amount')) || 0;
                targets[dealType] = target;
            }

            // Fetch current year closed deals (won) for this rep, grouped by deal type
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
                var dealType = dealGr.getValue('deal_type') || 'other';
                var amount = parseFloat(dealGr.getValue('amount')) || 0;
                
                if (!achieved[dealType]) {
                    achieved[dealType] = 0;
                }
                achieved[dealType] += amount;
            }

            // Build progress structure
            Object.keys(targets).forEach(function(dealType) {
                var target = targets[dealType];
                var achieved_amount = achieved[dealType] || 0;
                var attainment_percent = target > 0 ? (achieved_amount / target) * 100 : 0;
                
                progress[dealType] = {
                    target_amount: target,
                    achieved_amount: achieved_amount,
                    remaining_amount: Math.max(target - achieved_amount, 0),
                    attainment_percent: Math.min(attainment_percent, 100),
                    is_over_quota: achieved_amount >= target
                };
            });

            return progress;

        } catch (e) {
            gs.error('CommissionProgressHelper.getQuotaProgress error: ' + e.getMessage());
            return {};
        }
    },

    searchUsers: function() {
        var searchTerm = this.getParameter('search_term') || '';
        
        if (!searchTerm || searchTerm.length < 2) {
            return this.getErrorJSON('Search term must be at least 2 characters');
        }

        try {
            // Search for user by name or ID
            var userGr = new GlideRecord('sys_user');
            userGr.addActiveQuery();
            
            // Try exact ID match first
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
            
            // Search by name fields
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

            // Fetch plan targets by deal type
            var targetGr = new GlideRecord('x_823178_commissio_plan_targets');
            targetGr.addQuery('commission_plan', planId);
            targetGr.orderBy('deal_type');
            targetGr.query();

            var totalQuota = 0;
            while (targetGr.next()) {
                var dealType = targetGr.getValue('deal_type');
                var amount = parseFloat(targetGr.getValue('annual_target_amount')) || 0;
                totalQuota += amount;
                details.targets[dealType] = amount;
            }
            details.total_quota = totalQuota;

            // Fetch commission tiers
            var tierGr = new GlideRecord('x_823178_commissio_plan_tiers');
            tierGr.addQuery('commission_plan', planId);
            tierGr.orderBy('attainment_floor_percent');
            tierGr.query();

            while (tierGr.next()) {
                var floor = parseFloat(tierGr.getValue('attainment_floor_percent')) || 0;
                var rate = parseFloat(tierGr.getValue('commission_rate_percent')) || 0;
                
                if (floor === 0) {
                    details.base_rate = rate;
                }
                
                details.tiers.push({
                    tier_name: tierGr.getValue('tier_name'),
                    floor_percent: floor,
                    rate_percent: rate
                });
            }

            // Fetch bonuses
            var bonusGr = new GlideRecord('x_823178_commissio_plan_bonuses');
            bonusGr.addQuery('commission_plan', planId);
            bonusGr.addQuery('is_active', true);
            bonusGr.orderBy('bonus_name');
            bonusGr.query();

            var totalBonusValue = 0;
            while (bonusGr.next()) {
                var bonusAmount = parseFloat(bonusGr.getValue('bonus_amount')) || 0;
                totalBonusValue += bonusAmount;
                details.bonuses.push({
                    name: bonusGr.getValue('bonus_name'),
                    amount: bonusAmount,
                    trigger: bonusGr.getValue('bonus_trigger'),
                    deal_type: bonusGr.getValue('deal_type'),
                    is_discretionary: bonusGr.getValue('is_discretionary') === '1' || bonusGr.getValue('is_discretionary') === true
                });
            }
            details.total_bonus_potential = totalBonusValue;

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

