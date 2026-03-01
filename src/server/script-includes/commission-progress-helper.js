// Script Include: CommissionProgressHelper
// Provides AJAX data aggregation for sales rep commission progress view

var CommissionProgressHelper = Class.create();
CommissionProgressHelper.prototype = Object.extendsObject(global.AbstractAjaxProcessor, {
    
    getRepProgress: function() {
        var userId = this.getParameter('sysparm_user_id') || this.getParameter('user_id');
        
        if (!userId) {
            return this.getErrorJSON('No user ID provided');
        }

        try {
            var result = {
                status: 'success',
                data: {
                    report_year: 0,
                    total_earned: 0,
                    pending_amount: 0,
                    pending_count: 0,
                    paid_amount: 0,
                    paid_count: 0,
                    explainability_summary: {},
                    active_deals_count: 0,
                    pipeline_value: 0,
                    breakdown: {},
                    deal_breakdown: {},
                    recent_calculations: [],
                    active_deals: [],
                    active_plan: null
                }
            };

            var requestedYear = parseInt(this.getParameter('sysparm_year') || this.getParameter('year'), 10);
            var today = new GlideDateTime();
            var currentYear = parseInt(today.getYearLocalTime(), 10);
            var selectedYear = (!isNaN(requestedYear) && requestedYear >= 2000 && requestedYear <= 2100) ? requestedYear : currentYear;

            var yearStart = selectedYear + '-01-01';
            var yearEnd = selectedYear + '-12-31';
            result.data.report_year = selectedYear;

            // Get plan that covers the selected year for this rep
            var planId = '';
            var planGr = new GlideRecord('x_823178_commissio_commission_plans');
            planGr.addQuery('sales_rep', userId);
            planGr.addQuery('is_active', true);
            planGr.addQuery('effective_start_date', '<=', yearEnd);
            planGr.addQuery('effective_end_date', '>=', yearStart);
            planGr.orderByDesc('effective_start_date');
            planGr.query();

            if (planGr.next()) {
                var planYearStr = planGr.getValue('effective_start_date');
                var planYear = planYearStr ? new GlideDateTime(planYearStr).getYearLocalTime() : selectedYear;
                planId = planGr.getValue('sys_id');
                
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
            var totalBaseComponent = 0;
            var totalAcceleratorDelta = 0;
            var totalBonusComponent = 0;
            var breakdown = { 'new_business': 0, 'renewal': 0, 'expansion': 0, 'upsell': 0, 'other': 0 };
            var recentCalcs = [];

            while (calcGr.next()) {
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

                var explainability = this.getExplainabilityComponentsFromCalc(calcGr);
                totalBaseComponent += explainability.base_component;
                totalAcceleratorDelta += explainability.accelerator_component;
                totalBonusComponent += explainability.bonus_component;

                // Breakdown by deal type (keys must match exactly)
                if (breakdown.hasOwnProperty(dealType)) {
                    breakdown[dealType] += commAmount;
                } else {
                    breakdown['other'] += commAmount;
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
                        base_component: explainability.base_component,
                        accelerator_component: explainability.accelerator_component,
                        bonus_component: explainability.bonus_component,
                        commission_amount: calcGr.getValue('commission_amount'),
                        payment_date: calcGr.getValue('payment_date'),
                        status: status
                    });
                }
            }

            result.data.total_earned = totalEarned;
            result.data.pending_amount = pendingAmount;
            result.data.pending_count = pendingCount;
            result.data.paid_amount = paidAmount;
            result.data.paid_count = paidCount;
            result.data.explainability_summary = {
                base_component: totalBaseComponent,
                accelerator_component: totalAcceleratorDelta,
                bonus_component: totalBonusComponent,
                explained_total: totalBaseComponent + totalAcceleratorDelta + totalBonusComponent,
                unexplained_delta: totalEarned - (totalBaseComponent + totalAcceleratorDelta + totalBonusComponent)
            };
            result.data.breakdown = breakdown;
            result.data.recent_calculations = recentCalcs;

            // Fetch active deals for this rep (current owner, not won/lost)
            var dealGr = new GlideRecord('x_823178_commissio_deals');
            dealGr.addQuery('current_owner', userId).addOrCondition('owner_at_close', userId);
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
                var dealType = dealGr.getValue('deal_type') || 'other';

                pipelineValue += dealAmount;

                if (dealBreakdown.hasOwnProperty(dealType)) {
                    dealBreakdown[dealType] += dealAmount;
                } else {
                    dealBreakdown['other'] += dealAmount;
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
                    var quotaProgress = this.getQuotaProgress(userId, planId, selectedYear);
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

    getQuotaProgress: function(userId, planId, reportYear) {
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

            var today = new GlideDateTime();
            var currentYear = parseInt(today.getYearLocalTime(), 10);
            var selectedYear = parseInt(reportYear, 10);
            if (isNaN(selectedYear) || selectedYear < 2000 || selectedYear > 2100) {
                selectedYear = currentYear;
            }
            var yearStart = selectedYear + '-01-01';
            var yearEnd = selectedYear + '-12-31';

            var dealGr = new GlideRecord('x_823178_commissio_deals');
            dealGr.addQuery('current_owner', userId).addOrCondition('owner_at_close', userId);
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

    getViewerAccess: function() {
        try {
            var user = gs.getUser();
            var isScopedAdmin = user.hasRole('x_823178_commissio.admin');
            var isSystemAdmin = user.hasRole('admin');
            var isFinance = user.hasRole('x_823178_commissio.finance');
            var isRep = user.hasRole('x_823178_commissio.rep');

            return JSON.stringify({
                status: 'success',
                data: {
                    can_select_users: !!(isScopedAdmin || isSystemAdmin),
                    roles: {
                        admin: !!(isScopedAdmin || isSystemAdmin),
                        finance: !!isFinance,
                        rep: !!isRep
                    }
                }
            });
        } catch (e) {
            gs.error('CommissionProgressHelper.getViewerAccess error: ' + e.getMessage());
            return this.getErrorJSON('Unable to resolve viewer access: ' + e.getMessage());
        }
    },

    getYearContext: function() {
        try {
            var requestedYear = parseInt(this.getParameter('sysparm_year') || this.getParameter('year'), 10);
            var requestedWindow = parseInt(this.getParameter('sysparm_year_window') || this.getParameter('year_window'), 10);
            var windowSize = (!isNaN(requestedWindow) && requestedWindow >= 1 && requestedWindow <= 5) ? requestedWindow : 2;

            var today = new GlideDateTime();
            var currentYear = parseInt(today.getYearLocalTime(), 10);
            var defaultYear = (!isNaN(requestedYear) && requestedYear >= 2000 && requestedYear <= 2100) ? requestedYear : currentYear;

            var years = [];
            for (var year = currentYear + windowSize; year >= currentYear - windowSize; year--) {
                years.push(year);
            }

            return JSON.stringify({
                status: 'success',
                data: {
                    current_year: currentYear,
                    default_year: defaultYear,
                    years: years
                }
            });
        } catch (e) {
            gs.error('CommissionProgressHelper.getYearContext error: ' + e.getMessage());
            return this.getErrorJSON('Unable to resolve year context: ' + e.getMessage());
        }
    },

    getDashboardMetrics: function() {
        try {
            var requestedYearRaw = this.getParameter('sysparm_year') || this.getParameter('year') || '';
            var isAllYears = String(requestedYearRaw).toLowerCase() === 'all';
            var requestedYear = parseInt(requestedYearRaw, 10);
            var today = new GlideDateTime();
            var currentYear = parseInt(today.getYearLocalTime(), 10);
            var selectedYear = (!isNaN(requestedYear) && requestedYear >= 2000 && requestedYear <= 2100) ? requestedYear : currentYear;
            var yearStart = selectedYear + '-01-01';
            var yearEnd = selectedYear + '-12-31';

            var statements = new GlideAggregate('x_823178_commissio_commission_statements');
            if (!isAllYears) {
                statements.addQuery('statement_year', selectedYear);
            }
            statements.addAggregate('COUNT');
            statements.query();
            var totalStatements = statements.next() ? parseInt(statements.getAggregate('COUNT'), 10) : 0;

            var pending = new GlideAggregate('x_823178_commissio_exception_approvals');
            pending.addQuery('status', 'pending');
            if (!isAllYears) {
                pending.addQuery('request_date', '>=', yearStart + ' 00:00:00');
                pending.addQuery('request_date', '<=', yearEnd + ' 23:59:59');
            }
            pending.addAggregate('COUNT');
            pending.query();
            var pendingReviews = pending.next() ? parseInt(pending.getAggregate('COUNT'), 10) : 0;

            var deals = new GlideAggregate('x_823178_commissio_deals');
            deals.addQuery('is_won', false);
            deals.addQuery('stage', '!=', 'closed_lost');
            deals.addAggregate('COUNT');
            deals.query();
            var activeDeals = deals.next() ? parseInt(deals.getAggregate('COUNT'), 10) : 0;

            var alerts = new GlideAggregate('x_823178_commissio_system_alerts');
            alerts.addQuery('status', 'IN', 'open,acknowledged');
            if (!isAllYears) {
                alerts.addQuery('alert_date', '>=', yearStart + ' 00:00:00');
                alerts.addQuery('alert_date', '<=', yearEnd + ' 23:59:59');
            }
            alerts.addAggregate('COUNT');
            alerts.query();
            var openAlerts = alerts.next() ? parseInt(alerts.getAggregate('COUNT'), 10) : 0;

            return JSON.stringify({
                status: 'success',
                data: {
                    report_year: isAllYears ? 'all' : selectedYear,
                    total_statements: totalStatements,
                    pending_reviews: pendingReviews,
                    active_deals: activeDeals,
                    open_alerts: openAlerts
                }
            });
        } catch (e) {
            gs.error('CommissionProgressHelper.getDashboardMetrics error: ' + e.getMessage());
            return this.getErrorJSON('Unable to load dashboard metrics: ' + e.getMessage());
        }
    },

    listUsersWithData: function() {
        try {
            var users = [];
            var seen = {};
            var requestedYear = parseInt(this.getParameter('sysparm_year') || this.getParameter('year'), 10);
            var selectedYear = (!isNaN(requestedYear) && requestedYear >= 2000 && requestedYear <= 2100) ? requestedYear : null;
            var yearStart = selectedYear ? (selectedYear + '-01-01') : '';
            var yearEnd = selectedYear ? (selectedYear + '-12-31') : '';

            var addUserById = function(repId) {
                if (!repId || seen[repId]) return;
                var repGr = new GlideRecord('sys_user');
                repGr.addQuery('sys_id', repId);
                repGr.addActiveQuery();
                repGr.query();
                if (repGr.next()) {
                    users.push({
                        user_id: repId,
                        user_name: repGr.getDisplayValue('name') || repGr.getDisplayValue()
                    });
                    seen[repId] = true;
                }
            };

            var planAgg = new GlideAggregate('x_823178_commissio_commission_plans');
            planAgg.addQuery('is_active', true);
            if (selectedYear) {
                planAgg.addQuery('effective_start_date', '<=', yearEnd);
                planAgg.addQuery('effective_end_date', '>=', yearStart).addOrCondition('effective_end_date', '');
            }
            planAgg.groupBy('sales_rep');
            planAgg.query();

            while (planAgg.next()) {
                addUserById(planAgg.getValue('sales_rep'));
            }

            users.sort(function(a, b) {
                var an = (a.user_name || '').toLowerCase();
                var bn = (b.user_name || '').toLowerCase();
                if (an < bn) return -1;
                if (an > bn) return 1;
                return 0;
            });

            return JSON.stringify({
                status: 'success',
                data: users
            });
        } catch (e) {
            gs.error('CommissionProgressHelper.listUsersWithData error: ' + e.getMessage());
            return this.getErrorJSON('Unable to load users: ' + e.getMessage());
        }
    },

    searchUsers: function() {
        var searchTerm = this.getParameter('sysparm_search_term') || this.getParameter('search_term') || '';
        
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
                var conditionSummary = bonusGr.getValue('condition_summary') || bonusGr.getValue('bonus_trigger') || '';
                var evaluationPeriod = bonusGr.getValue('evaluation_period') || 'calculation';
                details.bonuses.push({
                    name: bonusGr.getValue('bonus_name'),
                    amount: bonusAmount,
                    trigger: conditionSummary,
                    qualification_metric: bonusGr.getValue('qualification_metric'),
                    qualification_operator: bonusGr.getValue('qualification_operator'),
                    qualification_threshold: bonusGr.getValue('qualification_threshold'),
                    evaluation_period: evaluationPeriod,
                    one_time_per_period: bonusGr.getValue('one_time_per_period') === '1' || bonusGr.getValue('one_time_per_period') === 'true' || bonusGr.getValue('one_time_per_period') === true,
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

    getExplainabilityComponentsFromCalc: function(calcGr) {
        var baseComponent = parseFloat(calcGr.getValue('base_commission_component'));
        var acceleratorComponent = parseFloat(calcGr.getValue('accelerator_delta_component'));
        var bonusComponent = parseFloat(calcGr.getValue('bonus_component'));

        if (!isNaN(baseComponent) && !isNaN(acceleratorComponent) && !isNaN(bonusComponent)) {
            return {
                base_component: baseComponent,
                accelerator_component: acceleratorComponent,
                bonus_component: bonusComponent
            };
        }

        var calculatedBase = 0;
        var calculatedAccelerator = 0;
        var calculatedBonus = parseFloat(calcGr.getValue('bonus_amount')) || 0;

        var commissionBaseAmount = parseFloat(calcGr.getValue('commission_base_amount')) || 0;
        var effectiveRate = parseFloat(calcGr.getValue('commission_rate')) || 0;
        var effectiveCommission = Math.round(commissionBaseAmount * (effectiveRate / 100) * 100) / 100;

        var inputsRaw = calcGr.getValue('calculation_inputs') || '';
        if (inputsRaw) {
            try {
                var inputs = JSON.parse(inputsRaw);
                var baseRate = parseFloat(inputs.baseRate);
                if (!isNaN(baseRate)) {
                    calculatedBase = Math.round(commissionBaseAmount * (baseRate / 100) * 100) / 100;
                    calculatedAccelerator = Math.round((effectiveCommission - calculatedBase) * 100) / 100;
                } else {
                    calculatedBase = effectiveCommission;
                    calculatedAccelerator = 0;
                }
            } catch (e) {
                calculatedBase = effectiveCommission;
                calculatedAccelerator = 0;
            }
        } else {
            calculatedBase = effectiveCommission;
            calculatedAccelerator = 0;
        }

        return {
            base_component: calculatedBase,
            accelerator_component: calculatedAccelerator,
            bonus_component: calculatedBonus
        };
    },

    getErrorJSON: function(msg) {
        return JSON.stringify({
            status: 'error',
            message: msg
        });
    },

    type: 'CommissionProgressHelper'
});

