import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

Record({
    $id: Now.ID['commission_progress_helper_script_include'],
    table: 'sys_script_include',
    data: {
        name: 'CommissionProgressDataServiceV2',
        active: true,
        client_callable: true,
        access: 'public',
        script: `
    function resolveCommissionRoleAccess(user) {
        var subject = user || gs.getUser();

        function hasRole(roleName) {
            try {
                if (!roleName) {
                    return false;
                }

                if (typeof gs.hasRole === 'function' && gs.hasRole(roleName)) {
                    return true;
                }

                if (!subject || typeof subject.hasRole !== 'function') {
                    return false;
                }

                return !!subject.hasRole(roleName);
            } catch (e) {
                return false;
            }
        }

        var roles = {
            admin: hasRole('x_823178_commissio.admin') || hasRole('admin'),
            manager: hasRole('x_823178_commissio.manager'),
            finance: hasRole('x_823178_commissio.finance'),
            rep: hasRole('x_823178_commissio.rep')
        };

        if (roles.admin || roles.manager || roles.finance) {
            roles.rep = true;
        }

        return {
            roles: roles,
            canSelectUsers: !!(roles.admin || roles.manager || roles.finance),
            canViewAllUsers: !!(roles.admin || roles.finance),
            canViewTeamRollup: !!(roles.admin || roles.manager),
            canReviewStatements: !!(roles.admin || roles.finance)
        };
    }

    var CommissionProgressDataServiceV2 = Class.create();
    CommissionProgressDataServiceV2.prototype = Object.extendsObject(global.AbstractAjaxProcessor, {
    
    getRepProgress: function() {
        var userId = this.getParameter('sysparm_user_id') || this.getParameter('user_id');
        var includeAllUsers = String(userId) === 'all';
        var includeTeamUsers = String(userId) === 'team';
        var currentViewerId = gs.getUserID();
        
        if (!userId) {
            return this.getErrorJSON('No user ID provided');
        }

        if (includeAllUsers && !this.isAdminViewer()) {
            return this.getErrorJSON('Only admins can view all users');
        }

        if (includeTeamUsers && !(this.isAdminViewer() || this.isManagerViewer())) {
            return this.getErrorJSON('Only admins or managers can view team rollups');
        }

        if (!includeAllUsers && !includeTeamUsers && !this.canViewUser(userId)) {
            return this.getErrorJSON('You do not have permission to view this representative');
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
                    deal_type_labels: {},
                    won_commissions_by_month: [],
                    recent_calculations: [],
                    active_deals: [],
                    active_plan: null
                }
            };
            var activeDealTypeLabels = this.getActiveDealTypeLabelMap();
            result.data.deal_type_labels = activeDealTypeLabels;

            var requestedYear = parseInt(this.getParameter('sysparm_year') || this.getParameter('year'), 10);
            var today = new GlideDateTime();
            var currentYear = parseInt(today.getYearLocalTime(), 10);
            var selectedYear = (!isNaN(requestedYear) && requestedYear >= 2000 && requestedYear <= 2100) ? requestedYear : currentYear;
            var yearStart = selectedYear + '-01-01';
            var yearEnd = selectedYear + '-12-31';
            result.data.report_year = selectedYear;

            var selectedUserIds = [];
            if (includeAllUsers) {
                selectedUserIds = this.listUserIdsForRollupScope(selectedYear, null);
                result.data.view_mode = 'all_users';
                result.data.selected_user_count = selectedUserIds.length;
            } else if (includeTeamUsers) {
                var managerScopeIds = this.getManagedUserIds(currentViewerId, true);
                selectedUserIds = this.listUserIdsForRollupScope(selectedYear, managerScopeIds);
                result.data.view_mode = 'team_rollup';
                result.data.selected_user_count = selectedUserIds.length;
            }

            var planId = '';
            if (!includeAllUsers && !includeTeamUsers) {
                var planGr = this.getActivePlanForUserYear(userId, yearStart, yearEnd);
                if (planGr) {
                    var planYearStr = planGr.getValue('effective_start_date');
                    var planYear = planYearStr ? new GlideDateTime(planYearStr).getYearLocalTime() : selectedYear;
                    planId = planGr.getValue('sys_id');
                    
                    var compDetails = this.getCompensationPlanDetails(planId);
                    var baseRate = compDetails.base_rate;
                    var totalQuota = compDetails.total_quota;
                    var resolvedPlanTarget = totalQuota;
                    var oTE100 = parseFloat(compDetails.ote_at_100_percent || 0);
                    var oteWithBonuses = oTE100 + compDetails.total_bonus_potential;
                    
                    result.data.active_plan = {
                        plan_name: planGr.getValue('plan_name'),
                        plan_target_amount: resolvedPlanTarget,
                        plan_year: selectedYear,
                        plan_effective_year: planYear,
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
            } else {
                var aggregatePlan = this.buildAggregatePlanSummary(selectedUserIds, selectedYear, includeAllUsers ? 'All Users Rollup' : 'Team Rollup');
                if (aggregatePlan) {
                    result.data.active_plan = aggregatePlan;
                }
            }

            var calcGr = new GlideRecord('x_823178_commissio_commission_calculations');
            if (includeAllUsers || includeTeamUsers) {
                if (selectedUserIds.length === 0) {
                    calcGr.addQuery('sys_id', '');
                } else {
                    calcGr.addQuery('sales_rep', 'IN', selectedUserIds.join(','));
                }
            } else {
                calcGr.addQuery('sales_rep', userId);
            }
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
            var breakdown = this.createDealTypeTotals(activeDealTypeLabels);
            var wonCommissionsByMonthMap = {};
            var recentCalcs = [];

            while (calcGr.next()) {
                var commAmount = parseFloat(calcGr.getValue('commission_amount')) || 0;
                var status = calcGr.getValue('status') || 'draft';
                var dealType = this.resolveDealTypeForRecord(calcGr, 'deal_type_ref', 'other');

                if (status === 'paid' || status === 'locked') {
                    paidAmount += commAmount;
                    paidCount++;
                } else if (status === 'draft') {
                    pendingAmount += commAmount;
                    pendingCount++;
                }
                totalEarned += commAmount;

                if (commAmount > 0 && status !== 'error') {
                    var wonDate = calcGr.getValue('payment_date') || calcGr.getValue('calculation_date') || '';
                    var wonMonth = this.getMonthKey(wonDate);
                    if (wonMonth && wonMonth !== 'unknown') {
                        if (!wonCommissionsByMonthMap[wonMonth]) {
                            wonCommissionsByMonthMap[wonMonth] = {
                                month: wonMonth,
                                total_commission: 0,
                                calculation_count: 0
                            };
                        }
                        wonCommissionsByMonthMap[wonMonth].total_commission += commAmount;
                        wonCommissionsByMonthMap[wonMonth].calculation_count += 1;
                    }
                }

                var explainability = this.getExplainabilityComponentsFromCalc(calcGr);
                totalBaseComponent += explainability.base_component;
                totalAcceleratorDelta += explainability.accelerator_component;
                totalBonusComponent += explainability.bonus_component;

                var breakdownType = dealType || 'other';
                if (!breakdown.hasOwnProperty(breakdownType)) {
                    breakdown[breakdownType] = 0;
                }
                breakdown[breakdownType] += commAmount;

                if (recentCalcs.length < 10) {
                    var calcDealName = calcGr.getDisplayValue('deal') || '';
                    var calcDealId = calcGr.getValue('deal') || '';
                    if (!calcDealName && calcDealId) {
                        var calcDealGr = new GlideRecord('x_823178_commissio_deals');
                        if (calcDealGr.get(calcDealId)) {
                            calcDealName = calcDealGr.getDisplayValue('deal_name') || calcDealGr.getValue('deal_name') || '';
                        }
                    }
                    if (!calcDealName) {
                        calcDealName = calcGr.getValue('deal_name') || calcGr.getDisplayValue('payment') || 'Deal unavailable';
                    }

                    var repName = '';
                    if (includeAllUsers) {
                        var repGr = new GlideRecord('sys_user');
                        if (repGr.get(calcGr.getValue('sales_rep'))) {
                            repName = repGr.getDisplayValue('name') || '';
                        }
                    }
                    
                    recentCalcs.push({
                        sales_rep_name: repName,
                        deal_name: calcDealName,
                        deal_display: calcDealName,
                        deal_type: dealType,
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
            result.data.won_commissions_by_month = this.toSortedWonCommissionSeries(wonCommissionsByMonthMap);
            result.data.recent_calculations = recentCalcs;

            var dealGr = new GlideRecord('x_823178_commissio_deals');
            if (includeAllUsers || includeTeamUsers) {
                if (selectedUserIds.length === 0) {
                    dealGr.addQuery('sys_id', '');
                } else {
                    this.addOwnerScopeQuery(dealGr, selectedUserIds);
                }
            } else {
                this.addOwnerScopeQuery(dealGr, userId);
            }
            this.addOpenDealStateQuery(dealGr);
            dealGr.orderBy('close_date');
            dealGr.query();

            var activeDeals = [];
            var pipelineValue = 0;
            var dealBreakdown = this.createDealTypeTotals(activeDealTypeLabels);
            var dealCount = 0;
            var activeDealTypeCache = {};

            while (dealGr.next() && dealCount < 50) {
                var dealAmount = parseFloat(dealGr.getValue('amount')) || 0;
                var dealType2 = this.resolvePrimaryDealTypeForDeal(dealGr, activeDealTypeCache);

                pipelineValue += dealAmount;

                var pipelineType = dealType2 || 'other';
                if (!dealBreakdown.hasOwnProperty(pipelineType)) {
                    dealBreakdown[pipelineType] = 0;
                }
                dealBreakdown[pipelineType] += dealAmount;

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
                    result.data.quota_progress = this.getQuotaProgress(userId, planId, selectedYear);
                } catch (quotaErr) {
                    gs.log('CommissionProgressDataService quota fetch warning: ' + this.getErrorMessage(quotaErr), 'CommissionProgressDataService');
                }
            } else if ((includeAllUsers || includeTeamUsers) && result.data.active_plan && result.data.active_plan.targets) {
                try {
                    result.data.quota_progress = this.getAggregateQuotaProgress(selectedUserIds, result.data.active_plan.targets, selectedYear);
                } catch (aggregateQuotaErr) {
                    gs.log('CommissionProgressDataService aggregate quota warning: ' + this.getErrorMessage(aggregateQuotaErr), 'CommissionProgressDataService');
                }
            }

            return JSON.stringify(result);

        } catch (e) {
            gs.error('CommissionProgressDataService.getRepProgress error: ' + this.getErrorMessage(e));
            return this.getErrorJSON('Error fetching commission progress: ' + this.getErrorMessage(e));
        }
    },

    getQuotaProgress: function(userId, planId, reportYear) {
        try {
            var progress = {};

            var targetGr = new GlideRecord('x_823178_commissio_plan_targets');
            targetGr.addQuery('commission_plan', planId);
            targetGr.query();

            var targets = {};
            while (targetGr.next()) {
                var dt = this.resolveDealTypeForRecord(targetGr, 'deal_type_ref', '');
                if (!dt) {
                    continue;
                }
                targets[dt] = (parseFloat(targets[dt]) || 0) + (parseFloat(targetGr.getValue('annual_target_amount')) || 0);
            }

            var tiers = this.getPlanTiersForProgress(planId);

            var today = new GlideDateTime();
            var currentYear = parseInt(today.getYearLocalTime(), 10);
            var selectedYear = parseInt(reportYear, 10);
            if (isNaN(selectedYear) || selectedYear < 2000 || selectedYear > 2100) {
                selectedYear = currentYear;
            }
            var yearStart = selectedYear + '-01-01';
            var yearEnd = selectedYear + '-12-31';

            var dealGr = new GlideRecord('x_823178_commissio_deals');
            this.addOwnerScopeQuery(dealGr, userId);
            this.addWonDealStateQuery(dealGr);
            this.addDateRangeQuery(dealGr, 'close_date', yearStart, yearEnd);
            dealGr.query();

            var achieved = {};
            var dealTypeCache = {};
            while (dealGr.next()) {
                var dt2 = this.resolvePrimaryDealTypeForDeal(dealGr, dealTypeCache);
                var amount = parseFloat(dealGr.getValue('amount')) || 0;
                if (!achieved[dt2]) achieved[dt2] = 0;
                achieved[dt2] += amount;
            }

            // Safety net: if won-stage flags are inconsistent, use recognized calculation bases.
            var calcAchieved = this.getAchievedFromCalculations(userId, yearStart, yearEnd);
            this.mergeAchievedByMax(achieved, calcAchieved);

            if (Object.keys(targets).length === 0) {
                var achievedKeys = Object.keys(achieved);
                if (achievedKeys.length > 0) {
                    for (var j = 0; j < achievedKeys.length; j++) {
                        targets[achievedKeys[j]] = 0;
                    }
                } else {
                    targets.new_business = 0;
                }
            }

            Object.keys(targets).forEach(function(dealType) {
                var target = targets[dealType];
                var achievedAmount = achieved[dealType] || 0;
                var attainment = target > 0 ? (achievedAmount / target) * 100 : 0;
                var scopedTiers = this.filterTiersForDealType(tiers, dealType);
                var activeTier = this.resolveTierByAttainment(scopedTiers, attainment);
                progress[dealType] = {
                    target_amount: target,
                    achieved_amount: achievedAmount,
                    remaining_amount: target - achievedAmount,
                    attainment_percent: attainment,
                    is_over_quota: achievedAmount >= target,
                    applied_tier_name: activeTier ? (activeTier.tier_name || 'Tier') : '',
                    applied_rate_percent: activeTier ? (parseFloat(activeTier.rate_percent) || 0) : 0,
                    accelerator_active: !!(activeTier && parseFloat(activeTier.floor_percent || 0) >= 100)
                };
            }, this);

            return progress;
        } catch (e) {
            gs.error('CommissionProgressDataService.getQuotaProgress error: ' + this.getErrorMessage(e));
            return {};
        }
    },

    getAggregateQuotaProgress: function(userIds, targets, reportYear) {
        var progress = {};
        if (!userIds || userIds.length === 0) return progress;

        var selectedYear = this.getValidYear(reportYear);
        var yearStart = selectedYear + '-01-01';
        var yearEnd = selectedYear + '-12-31';

        var achieved = {};
        var dealGr = new GlideRecord('x_823178_commissio_deals');
        this.addOwnerScopeQuery(dealGr, userIds);
        this.addWonDealStateQuery(dealGr);
        this.addDateRangeQuery(dealGr, 'close_date', yearStart, yearEnd);
        dealGr.query();

        var dealTypeCache = {};

        while (dealGr.next()) {
            var dt = this.resolvePrimaryDealTypeForDeal(dealGr, dealTypeCache);
            var amount = parseFloat(dealGr.getValue('amount')) || 0;
            achieved[dt] = (achieved[dt] || 0) + amount;
        }

        var calcAchieved = this.getAchievedFromCalculations(userIds, yearStart, yearEnd);
        this.mergeAchievedByMax(achieved, calcAchieved);

        Object.keys(targets || {}).forEach(function(dealType) {
            var normalizedDealType = this.normalizeDealType(dealType);
            var target = parseFloat(targets[dealType]) || 0;
            var achievedAmount = achieved[normalizedDealType] || 0;
            var attainment = target > 0 ? (achievedAmount / target) * 100 : 0;
            progress[normalizedDealType] = {
                target_amount: target,
                achieved_amount: achievedAmount,
                remaining_amount: target - achievedAmount,
                attainment_percent: attainment,
                is_over_quota: achievedAmount >= target,
                applied_tier_name: '',
                applied_rate_percent: 0,
                accelerator_active: attainment >= 100
            };
        }, this);

        return progress;
    },

    getAchievedFromCalculations: function(userScope, yearStart, yearEnd) {
        var achieved = {};
        var calcGr = new GlideRecord('x_823178_commissio_commission_calculations');
        if (Array.isArray(userScope)) {
            if (userScope.length === 0) return achieved;
            calcGr.addQuery('sales_rep', 'IN', userScope.join(','));
        } else {
            if (!userScope) return achieved;
            calcGr.addQuery('sales_rep', userScope);
        }
        calcGr.addQuery('calculation_date', '>=', yearStart);
        calcGr.addQuery('calculation_date', '<=', yearEnd);
        calcGr.addQuery('status', '!=', 'error');
        calcGr.query();

        while (calcGr.next()) {
            var dealType = this.resolveDealTypeForRecord(calcGr, 'deal_type_ref', '');
            if (!dealType) continue;

            var baseAmount = parseFloat(calcGr.getValue('commission_base_amount')) || 0;
            if (baseAmount <= 0) continue;

            achieved[dealType] = (achieved[dealType] || 0) + baseAmount;
        }
        return achieved;
    },

    mergeAchievedByMax: function(primary, secondary) {
        var source = secondary || {};
        var target = primary || {};
        var keys = Object.keys(source);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var incoming = parseFloat(source[key]) || 0;
            var existing = parseFloat(target[key]) || 0;
            if (incoming > existing) {
                target[key] = incoming;
            } else if (!target.hasOwnProperty(key)) {
                target[key] = incoming;
            }
        }
        return target;
    },

    getActiveDealTypeLabelMap: function() {
        var labels = {};
        try {
            var typeGr = new GlideRecord('x_823178_commissio_deal_types');
            typeGr.addEncodedQuery('is_active=true^ORis_active=1');
            typeGr.orderBy('display_order');
            typeGr.orderBy('name');
            typeGr.query();

            while (typeGr.next()) {
                var normalizedCode = this.resolvePreferredDealTypeCode(typeGr.getValue('code'), typeGr.getValue('name'), '');
                if (!normalizedCode || labels[normalizedCode]) {
                    continue;
                }
                var label = (typeGr.getValue('name') || '').toString();
                if (!label) {
                    label = normalizedCode.replace(/_/g, ' ');
                }
                labels[normalizedCode] = label;
            }
        } catch (e) {
            // If lookup fails, UI will fall back to friendly formatting.
        }

        if (!labels.other) {
            labels.other = 'Other';
        }
        return labels;
    },

    createDealTypeTotals: function(labelMap) {
        var totals = {};
        var labels = labelMap || {};
        var keys = Object.keys(labels);
        for (var i = 0; i < keys.length; i++) {
            totals[keys[i]] = 0;
        }
        if (!totals.hasOwnProperty('other')) {
            totals.other = 0;
        }
        return totals;
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
            gs.error('CommissionProgressDataService.getCurrentUser error: ' + this.getErrorMessage(e));
            return this.getErrorJSON('Unable to resolve current user: ' + this.getErrorMessage(e));
        }
    },

    getViewerAccess: function() {
        try {
            var access = this.getRoleAccessContext();
            var roleMap = access && access.roles ? access.roles : {};
            var roles = {
                admin: !!roleMap.admin,
                manager: !!roleMap.manager,
                finance: !!roleMap.finance,
                rep: true
            };

            var managerScopeCount = 0;
            if (roles.manager) {
                try {
                    managerScopeCount = this.getManagedUserIds(gs.getUserID(), false).length;
                } catch (ignored) {
                    managerScopeCount = 0;
                }
            }

            return JSON.stringify({
                status: 'success',
                data: {
                    can_select_users: !!(roles.admin || roles.manager || roles.finance),
                    can_view_all_users: !!(roles.admin || roles.finance),
                    can_view_team_rollup: !!(roles.admin || roles.manager),
                    manager_scope_count: managerScopeCount,
                    roles: roles
                }
            });
        } catch (e) {
            gs.error('CommissionProgressDataService.getViewerAccess error: ' + this.getErrorMessage(e));
            return this.getErrorJSON('Unable to resolve viewer access: ' + this.getErrorMessage(e));
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
            gs.error('CommissionProgressDataService.getYearContext error: ' + this.getErrorMessage(e));
            return this.getErrorJSON('Unable to resolve year context: ' + this.getErrorMessage(e));
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

            var countRows = function(tableName, configureQuery, includeRecord) {
                var gr = new GlideRecord(tableName);
                if (typeof configureQuery === 'function') {
                    configureQuery(gr);
                }
                gr.query();

                var count = 0;
                while (gr.next()) {
                    if (!includeRecord || includeRecord(gr)) {
                        count++;
                    }
                }
                return count;
            };

            var totalStatements = countRows('x_823178_commissio_commission_statements', function(gr) {
                if (!isAllYears) {
                    gr.addQuery('statement_year', selectedYear);
                }
            });

            var pendingReviews = countRows('x_823178_commissio_exception_approvals', function(gr) {
                if (!isAllYears) {
                    gr.addQuery('request_date', '>=', yearStart + ' 00:00:00');
                    gr.addQuery('request_date', '<=', yearEnd + ' 23:59:59');
                }
            }, function(gr) {
                var status = String(gr.getValue('status') || '').toLowerCase();
                return status === 'pending';
            });

            var activeDeals = countRows('x_823178_commissio_deals', null, function(gr) {
                var stage = String(gr.getValue('stage') || '').toLowerCase().replace(/\s+/g, '_');
                var isWonRaw = String(gr.getValue('is_won') || '').toLowerCase();
                var isWon = isWonRaw === 'true' || isWonRaw === '1';

                if (stage === 'closed_lost' || stage === 'closed_won') {
                    return false;
                }
                return !isWon;
            });

            var openAlerts = countRows('x_823178_commissio_system_alerts', function(gr) {
                if (!isAllYears) {
                    gr.addQuery('alert_date', '>=', yearStart + ' 00:00:00');
                    gr.addQuery('alert_date', '<=', yearEnd + ' 23:59:59');
                }
            }, function(gr) {
                var status = String(gr.getValue('status') || '').toLowerCase();
                return status === 'open' || status === 'acknowledged';
            });

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
            gs.error('CommissionProgressDataService.getDashboardMetrics error: ' + this.getErrorMessage(e));
            return this.getErrorJSON('Unable to load dashboard metrics: ' + this.getErrorMessage(e));
        }
    },

    listUsersWithData: function() {
        try {
            var users = [];
            var seen = {};
            var access = this.getRoleAccessContext();
            var roleMap = access && access.roles ? access.roles : {};
            var isAdmin = !!roleMap.admin;
            var isManager = !!roleMap.manager;
            var viewerId = gs.getUserID();
            var requestedYear = parseInt(this.getParameter('sysparm_year') || this.getParameter('year'), 10);
            var selectedYear = (!isNaN(requestedYear) && requestedYear >= 2000 && requestedYear <= 2100) ? requestedYear : null;
            var yearStart = selectedYear ? (selectedYear + '-01-01') : '';
            var yearEnd = selectedYear ? (selectedYear + '-12-31') : '';
            var managerScopeIds = isManager && !isAdmin ? this.getManagedUserIds(viewerId, true) : null;

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
            // Representative selector should reflect active assignments, regardless of selected report year.
            if (managerScopeIds && managerScopeIds.length > 0) {
                planAgg.addQuery('sales_rep', 'IN', managerScopeIds.join(','));
            } else if (!isAdmin && !isManager) {
                planAgg.addQuery('sales_rep', viewerId);
            }
            planAgg.groupBy('sales_rep');
            planAgg.query();

            while (planAgg.next()) {
                addUserById(planAgg.getValue('sales_rep'));
            }

            if (users.length === 0) {
                var anyPlanAgg = new GlideAggregate('x_823178_commissio_commission_plans');
                if (managerScopeIds && managerScopeIds.length > 0) {
                    anyPlanAgg.addQuery('sales_rep', 'IN', managerScopeIds.join(','));
                } else if (!isAdmin && !isManager) {
                    anyPlanAgg.addQuery('sales_rep', viewerId);
                }
                anyPlanAgg.groupBy('sales_rep');
                anyPlanAgg.query();
                while (anyPlanAgg.next()) {
                    addUserById(anyPlanAgg.getValue('sales_rep'));
                }
            }

            if (users.length === 0) {
                var calcAgg = new GlideAggregate('x_823178_commissio_commission_calculations');
                if (selectedYear) {
                    calcAgg.addQuery('calculation_date', '>=', yearStart);
                    calcAgg.addQuery('calculation_date', '<=', yearEnd);
                }
                if (managerScopeIds && managerScopeIds.length > 0) {
                    calcAgg.addQuery('sales_rep', 'IN', managerScopeIds.join(','));
                } else if (!isAdmin && !isManager) {
                    calcAgg.addQuery('sales_rep', viewerId);
                }
                calcAgg.groupBy('sales_rep');
                calcAgg.query();

                while (calcAgg.next()) {
                    addUserById(calcAgg.getValue('sales_rep'));
                }
            }

            if (users.length === 0) {
                var dealAgg = new GlideAggregate('x_823178_commissio_deals');
                if (selectedYear) {
                    this.addDateRangeQuery(dealAgg, 'close_date', yearStart, yearEnd);
                }
                if (managerScopeIds && managerScopeIds.length > 0) {
                    dealAgg.addQuery('current_owner', 'IN', managerScopeIds.join(',')).addOrCondition('owner_at_close', 'IN', managerScopeIds.join(','));
                } else if (!isAdmin && !isManager) {
                    dealAgg.addQuery('current_owner', viewerId).addOrCondition('owner_at_close', viewerId);
                }
                dealAgg.groupBy('current_owner');
                dealAgg.query();
                while (dealAgg.next()) {
                    addUserById(dealAgg.getValue('current_owner'));
                }
            }

            if (users.length === 0 && viewerId) {
                addUserById(viewerId);
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
            gs.error('CommissionProgressDataService.listUsersWithData error: ' + this.getErrorMessage(e));
            return this.getErrorJSON('Unable to load users: ' + this.getErrorMessage(e));
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
            gs.error('CommissionProgressDataService.searchUsers error: ' + this.getErrorMessage(e));
            return this.getErrorJSON('Error searching users: ' + this.getErrorMessage(e));
        }
    },

    getStatementExplainability: function() {
        var statementId = this.getParameter('sysparm_statement_id') || this.getParameter('statement_id') || '';

        try {
            var statementGr = new GlideRecord('x_823178_commissio_commission_statements');

            if (statementId) {
                if (!statementGr.get(statementId)) {
                    return this.getErrorJSON('Statement not found');
                }

                if (!this.canViewUser(statementGr.getValue('sales_rep')) && !this.isFinanceViewer()) {
                    return this.getErrorJSON('You do not have permission to view this statement');
                }
            } else {
                this.applyStatementViewerScope(statementGr);
                statementGr.orderByDesc('statement_year');
                statementGr.orderByDesc('statement_month');
                statementGr.orderByDesc('generated_date');
                statementGr.setLimit(1);
                statementGr.query();

                if (!statementGr.next()) {
                    return JSON.stringify({
                        status: 'success',
                        data: {
                            statement: null,
                            summary: {
                                base_component: 0,
                                accelerator_component: 0,
                                bonus_component: 0,
                                total_commission: 0,
                                unexplained_delta: 0,
                                line_items_count: 0
                            },
                            line_items: []
                        }
                    });
                }
            }

            var payload = this.buildStatementExplainabilityPayload(statementGr);
            return JSON.stringify({ status: 'success', data: payload });
        } catch (e) {
            gs.error('CommissionProgressDataService.getStatementExplainability error: ' + this.getErrorMessage(e));
            return this.getErrorJSON('Unable to load statement explainability: ' + this.getErrorMessage(e));
        }
    },

    applyStatementViewerScope: function(statementGr) {
        if (this.isAdminViewer() || this.isFinanceViewer()) {
            return;
        }

        var viewerId = gs.getUserID();
        if (this.isManagerViewer()) {
            var managedIds = this.getManagedUserIds(viewerId, true);
            if (managedIds.length === 0) {
                statementGr.addQuery('sys_id', '');
                return;
            }
            statementGr.addQuery('sales_rep', 'IN', managedIds.join(','));
            return;
        }

        statementGr.addQuery('sales_rep', viewerId);
    },

    buildStatementExplainabilityPayload: function(statementGr) {
        var lineItems = [];
        var totals = {
            base_component: 0,
            accelerator_component: 0,
            bonus_component: 0,
            total_commission: 0
        };

        var calcGr = new GlideRecord('x_823178_commissio_commission_calculations');
        calcGr.addQuery('statement', statementGr.getUniqueValue());
        calcGr.orderByDesc('calculation_date');
        calcGr.query();

        while (calcGr.next()) {
            var explainability = this.getExplainabilityComponentsFromCalc(calcGr);
            var commissionAmount = parseFloat(calcGr.getValue('commission_amount')) || 0;

            totals.base_component += explainability.base_component;
            totals.accelerator_component += explainability.accelerator_component;
            totals.bonus_component += explainability.bonus_component;
            totals.total_commission += commissionAmount;

            var dealName = '';
            var dealGr = new GlideRecord('x_823178_commissio_deals');
            if (dealGr.get(calcGr.getValue('deal'))) {
                dealName = dealGr.getDisplayValue('deal_name') || dealGr.getValue('deal_name') || '';
            }

            lineItems.push({
                calculation_id: calcGr.getUniqueValue(),
                deal_name: dealName,
                deal_type: this.resolveDealTypeForRecord(calcGr, 'deal_type_ref', 'other'),
                payment_date: calcGr.getValue('payment_date') || '',
                status: calcGr.getValue('status') || 'draft',
                base_component: explainability.base_component,
                accelerator_component: explainability.accelerator_component,
                bonus_component: explainability.bonus_component,
                commission_amount: commissionAmount
            });
        }

        var statementTotal = parseFloat(statementGr.getValue('total_commission_amount'));
        if (!isNaN(statementTotal)) {
            totals.total_commission = statementTotal;
        }

        var storedBase = parseFloat(statementGr.getValue('total_base_commission'));
        var storedAccelerator = parseFloat(statementGr.getValue('total_accelerator_delta'));
        var storedBonus = parseFloat(statementGr.getValue('total_bonus_amount'));
        if (!isNaN(storedBase)) totals.base_component = storedBase;
        if (!isNaN(storedAccelerator)) totals.accelerator_component = storedAccelerator;
        if (!isNaN(storedBonus)) totals.bonus_component = storedBonus;

        var explainedTotal = totals.base_component + totals.accelerator_component + totals.bonus_component;

        return {
            statement: {
                sys_id: statementGr.getUniqueValue(),
                statement_number: statementGr.getValue('statement_number') || '',
                sales_rep: statementGr.getValue('sales_rep') || '',
                sales_rep_name: statementGr.getDisplayValue('sales_rep') || '',
                statement_year: statementGr.getValue('statement_year') || '',
                statement_month: statementGr.getValue('statement_month') || '',
                period_start_date: statementGr.getValue('period_start_date') || '',
                period_end_date: statementGr.getValue('period_end_date') || '',
                status: statementGr.getValue('status') || 'draft',
                total_commission_amount: totals.total_commission
            },
            summary: {
                base_component: totals.base_component,
                accelerator_component: totals.accelerator_component,
                bonus_component: totals.bonus_component,
                total_commission: totals.total_commission,
                unexplained_delta: totals.total_commission - explainedTotal,
                line_items_count: lineItems.length
            },
            line_items: lineItems
        };
    },

    getCompensationPlanDetails: function(planId) {
        try {
            var details = {
                targets: {},
                tiers: [],
                bonuses: [],
                total_quota: 0,
                base_rate: 0,
                rate_card: {
                    new_business: 0,
                    renewal: 0,
                    expansion: 0,
                    upsell: 0
                },
                ote_at_100_percent: 0,
                total_bonus_potential: 0
            };

            if (!planId) return details;

            var targetGr = new GlideRecord('x_823178_commissio_plan_targets');
            targetGr.addQuery('commission_plan', planId);
            targetGr.orderBy('deal_type_ref');
            targetGr.query();

            while (targetGr.next()) {
                var dealType = this.resolveDealTypeForRecord(targetGr, 'deal_type_ref', '');
                if (!dealType) {
                    continue;
                }
                var amount = parseFloat(targetGr.getValue('annual_target_amount')) || 0;
                var targetRate = parseFloat(targetGr.getValue('commission_rate_percent')) || 0;
                details.total_quota += amount;
                details.targets[dealType] = (parseFloat(details.targets[dealType]) || 0) + amount;
                if (targetRate > 0) {
                    details.rate_card[dealType] = targetRate;
                }
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
                    rate_percent: rate,
                    deal_type: this.resolveDealTypeForTier(tierGr, ''),
                    plan_target: tierGr.getValue('plan_target') || ''
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
                    deal_type: this.resolveDealTypeForRecord(bonusGr, 'deal_type_ref', ''),
                    is_discretionary: bonusGr.getValue('is_discretionary') === '1' || bonusGr.getValue('is_discretionary') === true
                });
            }

            var oteAtTarget = 0;
            var targetTypes = Object.keys(details.targets || {});
            for (var i = 0; i < targetTypes.length; i++) {
                var targetDealType = this.normalizeDealType(targetTypes[i]);
                var targetAmount = parseFloat(details.targets[targetTypes[i]] || 0);
                var targetRate = 0;

                if (targetDealType === 'new_business') targetRate = parseFloat(details.rate_card.new_business || 0);
                else if (targetDealType === 'renewal') targetRate = parseFloat(details.rate_card.renewal || 0);
                else if (targetDealType === 'expansion') targetRate = parseFloat(details.rate_card.expansion || 0);
                else if (targetDealType === 'upsell') targetRate = parseFloat(details.rate_card.upsell || 0);

                oteAtTarget += targetAmount * (targetRate / 100);
            }

            details.ote_at_100_percent = this.round2(oteAtTarget);

            return details;
        } catch (e) {
            gs.error('CommissionProgressDataService.getCompensationPlanDetails error: ' + this.getErrorMessage(e));
            return {
                targets: {},
                tiers: [],
                bonuses: [],
                total_quota: 0,
                base_rate: 0,
                rate_card: { new_business: 0, renewal: 0, expansion: 0, upsell: 0 },
                ote_at_100_percent: 0,
                total_bonus_potential: 0
            };
        }
    },

    getForecastAndPriorities: function() {
        var userId = this.getParameter('sysparm_user_id') || gs.getUserID();
        var selectedYear = this.getValidYear(this.getParameter('sysparm_year'));
        var scenarioId = this.getParameter('sysparm_scenario_id') || '';

        try {
            var plan = this.getForecastPlan(userId, selectedYear);
            var planId = plan ? plan.getUniqueValue() : '';
            var quota = this.getForecastTotalQuota(planId);
            var rateCard = this.getForecastRateCard(planId);
            var scenario = this.getForecastScenario(scenarioId, userId, selectedYear);

            var overrideWin = parseFloat(this.getParameter('sysparm_win_rate_multiplier') || '');
            var overridePipeline = parseFloat(this.getParameter('sysparm_pipeline_multiplier') || '');

            var winRateMultiplier = this.normalizeMultiplier(!isNaN(overrideWin) ? overrideWin : scenario.win_rate_multiplier);
            var pipelineMultiplier = this.normalizeMultiplier(!isNaN(overridePipeline) ? overridePipeline : scenario.pipeline_multiplier);

            var prioritized = [];
            var payoutTimelineMap = {};
            var basisCounts = {};
            var totals = {
                expected_revenue: 0,
                expected_commission: 0,
                active_deals: 0,
                won_revenue_ytd: this.getWonRevenueYtd(userId, selectedYear),
                total_quota: quota
            };

            var stageProbability = {
                lead: 0.2,
                qualified: 0.4,
                proposal: 0.6,
                negotiation: 0.8,
                closed_won: 1
            };

            var dealsGr = new GlideRecord('x_823178_commissio_deals');
            this.addOwnerScopeQuery(dealsGr, userId);
            this.addOpenDealStateQuery(dealsGr);
            dealsGr.query();
            var forecastDealTypeCache = {};

            while (dealsGr.next()) {
                var amount = parseFloat(dealsGr.getValue('amount')) || 0;
                var dealType = this.resolvePrimaryDealTypeForDeal(dealsGr, forecastDealTypeCache);
                var stage = dealsGr.getValue('stage') || 'lead';
                var rate = this.resolveForecastRate(rateCard, dealType);
                var probability = (stageProbability[stage] || 0.3) * winRateMultiplier;
                if (probability > 1) probability = 1;

                var adjustedAmount = amount * pipelineMultiplier;
                var expectedRevenue = adjustedAmount * probability;
                var expectedCommission = expectedRevenue * (rate / 100);
                var recognitionProjection = this.getForecastRecognitionProjection(planId, dealsGr.getValue('close_date'), stage, selectedYear);
                var urgencyBoost = this.getForecastUrgencyBoost(dealsGr.getValue('close_date'));
                var score = expectedCommission * (1 + urgencyBoost);

                totals.active_deals++;
                totals.expected_revenue += expectedRevenue;
                totals.expected_commission += expectedCommission;

                var monthKey = this.getMonthKey(recognitionProjection.payout_eligible_date || recognitionProjection.recognition_date || dealsGr.getValue('close_date'));
                if (!payoutTimelineMap[monthKey]) {
                    payoutTimelineMap[monthKey] = {
                        month: monthKey,
                        expected_commission: 0,
                        expected_revenue: 0,
                        deal_count: 0
                    };
                }
                payoutTimelineMap[monthKey].expected_commission += expectedCommission;
                payoutTimelineMap[monthKey].expected_revenue += expectedRevenue;
                payoutTimelineMap[monthKey].deal_count += 1;

                var basisKey = recognitionProjection.recognition_basis || 'cash_received';
                basisCounts[basisKey] = (basisCounts[basisKey] || 0) + 1;

                prioritized.push({
                    deal_id: dealsGr.getUniqueValue(),
                    deal_name: dealsGr.getValue('deal_name'),
                    account_name: dealsGr.getValue('account_name'),
                    deal_type: dealType,
                    stage: stage,
                    close_date: dealsGr.getValue('close_date'),
                    amount: amount,
                    probability: probability,
                    commission_rate: rate,
                    recognition_basis: recognitionProjection.recognition_basis,
                    projected_recognition_date: recognitionProjection.recognition_date,
                    projected_payout_eligible_date: recognitionProjection.payout_eligible_date,
                    expected_commission: expectedCommission,
                    priority_score: score
                });
            }

            prioritized.sort(function(a, b) {
                return b.priority_score - a.priority_score;
            });

            var projectedRevenue = totals.won_revenue_ytd + totals.expected_revenue;
            var projectedAttainment = totals.total_quota > 0 ? (projectedRevenue / totals.total_quota) * 100 : 0;
            var payoutTimeline = this.toSortedTimeline(payoutTimelineMap);

            return JSON.stringify({
                status: 'success',
                data: {
                    summary: {
                        report_year: selectedYear,
                        active_scenario_id: scenario.scenario_id || '',
                        active_scenario_name: scenario.scenario_name || '',
                        win_rate_multiplier: winRateMultiplier,
                        pipeline_multiplier: pipelineMultiplier,
                        active_deals: totals.active_deals,
                        won_revenue_ytd: this.round2(totals.won_revenue_ytd),
                        expected_revenue: this.round2(totals.expected_revenue),
                        expected_commission: this.round2(totals.expected_commission),
                        total_quota: this.round2(totals.total_quota),
                        projected_attainment_percent: this.round2(projectedAttainment),
                        recognition_basis: this.resolveDominantRecognitionBasis(basisCounts)
                    },
                    payout_timeline: payoutTimeline,
                    prioritized_deals: prioritized.slice(0, 10),
                    scenarios: this.listForecastScenariosInternal(userId, selectedYear)
                }
            });
        } catch (e) {
            gs.error('CommissionProgressDataService.getForecastAndPriorities error: ' + this.getErrorMessage(e));
            return this.getErrorJSON('Unable to calculate forecast insights');
        }
    },

    getEstimatorDealTypes: function() {
        try {
            var canonicalOrder = ['new_business', 'renewal', 'expansion', 'upsell', 'other'];
            var typeMap = {};
            var typeGr = new GlideRecord('x_823178_commissio_deal_types');
            typeGr.addEncodedQuery('is_active=true^ORis_active=1');
            typeGr.orderBy('display_order');
            typeGr.orderBy('name');
            typeGr.query();

            while (typeGr.next()) {
                var rawCode = typeGr.getValue('code') || '';
                var code = this.normalizeDealType(rawCode);
                if (!code || typeMap[code]) {
                    continue;
                }
                typeMap[code] = true;
            }

            var options = [];
            for (var i = 0; i < canonicalOrder.length; i++) {
                var candidate = canonicalOrder[i];
                if (typeMap[candidate]) {
                    options.push(candidate);
                    delete typeMap[candidate];
                }
            }

            // Keep any additional custom deal types available to the estimator.
            for (var key in typeMap) {
                if (typeMap.hasOwnProperty(key)) {
                    options.push(this.normalizeDealType(key));
                }
            }

            if (options.length === 0) {
                options = canonicalOrder.slice(0, 4);
            }

            return JSON.stringify({
                status: 'success',
                data: options
            });
        } catch (e) {
            gs.error('CommissionProgressDataService.getEstimatorDealTypes error: ' + this.getErrorMessage(e));
            return this.getErrorJSON('Unable to load estimator deal types');
        }
    },

    estimateCommission: function() {
        var userId = this.getParameter('sysparm_user_id') || gs.getUserID();
        var selectedYear = this.getValidYear(this.getParameter('sysparm_year'));
        var dealType = this.getParameter('sysparm_deal_type') || 'new_business';
        var closeDateRaw = this.getParameter('sysparm_close_date') || '';
        var amount = parseFloat(this.getParameter('sysparm_amount') || '0');

        if (!this.canViewUser(userId)) {
            return this.getErrorJSON('You do not have permission to estimate for this representative');
        }

        if (!amount || amount <= 0) {
            return this.getErrorJSON('Enter an amount greater than 0 for the estimator');
        }

        if (!closeDateRaw) {
            return this.getErrorJSON('Select an expected close date for the estimator');
        }

        var closeYear = parseInt(String(closeDateRaw).substring(0, 4), 10);
        if (!isNaN(closeYear) && closeYear >= 2000 && closeYear <= 2100) {
            selectedYear = closeYear;
        }

        try {
            var plan = this.getForecastPlan(userId, selectedYear);
            if (!plan) {
                return this.getErrorJSON('No active commission plan found for the selected close date year');
            }

            var planId = plan.getUniqueValue();
            var rateCard = this.getForecastRateCard(planId);
            var quota = this.getForecastTotalQuota(planId);
            var wonRevenueBeforeClose = this.getWonRevenueYtdUntilDate(userId, selectedYear, closeDateRaw);
            var projectedRevenue = wonRevenueBeforeClose + amount;
            var currentAttainment = quota > 0 ? (wonRevenueBeforeClose / quota) * 100 : 0;
            var projectedAttainment = quota > 0 ? (projectedRevenue / quota) * 100 : 0;

            var projectedTier = this.resolveTierByAttainment(this.filterTiersForDealType(this.getPlanTiersForProgress(planId), dealType), projectedAttainment);
            var rate = projectedTier ? (parseFloat(projectedTier.rate_percent) || 0) : this.resolveForecastRate(rateCard, dealType);
            var expectedPayout = amount * (rate / 100);
            var projection = this.getForecastRecognitionProjection(planId, closeDateRaw, 'proposal', selectedYear);

            return JSON.stringify({
                status: 'success',
                data: {
                    amount: this.round2(amount),
                    close_date: closeDateRaw,
                    report_year: selectedYear,
                    commission_rate_percent: this.round2(rate),
                    expected_payout: this.round2(expectedPayout),
                    expected_commission: this.round2(expectedPayout),
                    current_attainment_percent: this.round2(currentAttainment),
                    projected_attainment_percent: this.round2(projectedAttainment),
                    applied_tier_name: projectedTier ? (projectedTier.tier_name || 'Tier') : 'Base Rate',
                    accelerator_applied: !!(projectedTier && parseFloat(projectedTier.floor_percent || 0) >= 100),
                    recognition_basis: projection.recognition_basis,
                    projected_recognition_date: projection.recognition_date,
                    projected_payout_eligible_date: projection.payout_eligible_date
                }
            });
        } catch (e) {
            gs.error('CommissionProgressDataService.estimateCommission error: ' + this.getErrorMessage(e));
            return this.getErrorJSON('Unable to run commission estimate');
        }
    },

    saveForecastScenario: function() {
        var userId = this.getParameter('sysparm_user_id') || gs.getUserID();
        var selectedYear = this.getValidYear(this.getParameter('sysparm_year'));
        var scenarioName = this.getParameter('sysparm_scenario_name') || ('Scenario ' + selectedYear);
        var winRateMultiplier = this.normalizeMultiplier(parseFloat(this.getParameter('sysparm_win_rate_multiplier') || '1'));
        var pipelineMultiplier = this.normalizeMultiplier(parseFloat(this.getParameter('sysparm_pipeline_multiplier') || '1'));

        try {
            var forecast = this.getForecastSummaryValues(userId, selectedYear, winRateMultiplier, pipelineMultiplier);
            var plan = this.getForecastPlan(userId, selectedYear);

            var scenarioGr = new GlideRecord('x_823178_commissio_forecast_scenarios');
            scenarioGr.initialize();
            scenarioGr.setValue('scenario_name', scenarioName);
            scenarioGr.setValue('sales_rep', userId);
            scenarioGr.setValue('scenario_year', selectedYear);
            if (plan && plan.sys_id) {
                scenarioGr.setValue('commission_plan', plan.sys_id);
            }
            scenarioGr.setValue('win_rate_multiplier', winRateMultiplier);
            scenarioGr.setValue('pipeline_multiplier', pipelineMultiplier);
            scenarioGr.setValue('projected_revenue', forecast.projected_revenue);
            scenarioGr.setValue('projected_commission', forecast.expected_commission);
            scenarioGr.setValue('projected_attainment_percent', forecast.projected_attainment_percent);
            scenarioGr.setValue('assumptions_json', JSON.stringify({
                win_rate_multiplier: winRateMultiplier,
                pipeline_multiplier: pipelineMultiplier,
                captured_on: new GlideDateTime().getDisplayValue()
            }));
            scenarioGr.setValue('status', 'draft');
            scenarioGr.setValue('is_active', true);

            var scenarioId = scenarioGr.insert();
            return JSON.stringify({
                status: 'success',
                data: {
                    scenario_id: scenarioId,
                    scenario_name: scenarioName,
                    projected_commission: this.round2(forecast.expected_commission),
                    projected_attainment_percent: this.round2(forecast.projected_attainment_percent)
                }
            });
        } catch (e) {
            gs.error('CommissionProgressDataService.saveForecastScenario error: ' + this.getErrorMessage(e));
            return this.getErrorJSON('Unable to save scenario');
        }
    },

    getForecastSummaryValues: function(userId, selectedYear, winRateMultiplier, pipelineMultiplier) {
        var plan = this.getForecastPlan(userId, selectedYear);
        var quota = this.getForecastTotalQuota(plan ? plan.sys_id : '');
        var rateCard = this.getForecastRateCard(plan ? plan.getUniqueValue() : '');

        var stageProbability = {
            lead: 0.2,
            qualified: 0.4,
            proposal: 0.6,
            negotiation: 0.8,
            closed_won: 1
        };

        var expectedRevenue = 0;
        var expectedCommission = 0;

        var dealsGr = new GlideRecord('x_823178_commissio_deals');
        this.addOwnerScopeQuery(dealsGr, userId);
        this.addOpenDealStateQuery(dealsGr);
        dealsGr.query();
        var summaryDealTypeCache = {};

        while (dealsGr.next()) {
            var amount = parseFloat(dealsGr.getValue('amount')) || 0;
            var dealType = this.resolvePrimaryDealTypeForDeal(dealsGr, summaryDealTypeCache);
            var stage = dealsGr.getValue('stage') || 'lead';
            var rate = this.resolveForecastRate(rateCard, dealType);
            var probability = (stageProbability[stage] || 0.3) * winRateMultiplier;
            if (probability > 1) probability = 1;

            var adjustedAmount = amount * pipelineMultiplier;
            var rev = adjustedAmount * probability;
            expectedRevenue += rev;
            expectedCommission += rev * (rate / 100);
        }

        var wonRevenue = this.getWonRevenueYtd(userId, selectedYear);
        var projectedRevenue = wonRevenue + expectedRevenue;
        var projectedAttainment = quota > 0 ? (projectedRevenue / quota) * 100 : 0;

        return {
            won_revenue_ytd: this.round2(wonRevenue),
            expected_revenue: this.round2(expectedRevenue),
            expected_commission: this.round2(expectedCommission),
            projected_revenue: this.round2(projectedRevenue),
            projected_attainment_percent: this.round2(projectedAttainment)
        };
    },

    listForecastScenariosInternal: function(userId, selectedYear) {
        var scenarios = [];
        var scenarioGr = new GlideRecord('x_823178_commissio_forecast_scenarios');
        scenarioGr.addQuery('sales_rep', userId);
        scenarioGr.addQuery('scenario_year', selectedYear);
        scenarioGr.addQuery('is_active', true);
        scenarioGr.orderByDesc('sys_updated_on');
        scenarioGr.query();

        while (scenarioGr.next()) {
            scenarios.push({
                scenario_id: scenarioGr.getUniqueValue(),
                scenario_name: scenarioGr.getValue('scenario_name'),
                status: scenarioGr.getValue('status') || 'draft',
                win_rate_multiplier: parseFloat(scenarioGr.getValue('win_rate_multiplier')) || 1,
                pipeline_multiplier: parseFloat(scenarioGr.getValue('pipeline_multiplier')) || 1,
                projected_revenue: parseFloat(scenarioGr.getValue('projected_revenue')) || 0,
                projected_commission: parseFloat(scenarioGr.getValue('projected_commission')) || 0,
                projected_attainment_percent: parseFloat(scenarioGr.getValue('projected_attainment_percent')) || 0
            });
        }

        return scenarios;
    },

    getForecastScenario: function(scenarioId, userId, selectedYear) {
        var fallback = {
            scenario_id: '',
            scenario_name: '',
            win_rate_multiplier: 1,
            pipeline_multiplier: 1
        };
        if (!scenarioId) return fallback;

        var scenarioGr = new GlideRecord('x_823178_commissio_forecast_scenarios');
        if (!scenarioGr.get(scenarioId)) return fallback;

        if (scenarioGr.getValue('sales_rep') !== userId || parseInt(scenarioGr.getValue('scenario_year'), 10) !== selectedYear) {
            return fallback;
        }

        return {
            scenario_id: scenarioGr.getUniqueValue(),
            scenario_name: scenarioGr.getValue('scenario_name') || '',
            win_rate_multiplier: parseFloat(scenarioGr.getValue('win_rate_multiplier')) || 1,
            pipeline_multiplier: parseFloat(scenarioGr.getValue('pipeline_multiplier')) || 1
        };
    },

    getForecastPlan: function(userId, selectedYear) {
        var yearStart = selectedYear + '-01-01';
        var yearEnd = selectedYear + '-12-31';
        return this.getActivePlanForUserYear(userId, yearStart, yearEnd);
    },

    getForecastTotalQuota: function(planId) {
        if (!planId) return 0;
        var total = 0;
        var targetGr = new GlideRecord('x_823178_commissio_plan_targets');
        targetGr.addQuery('commission_plan', planId);
        targetGr.addQuery('is_active', true);
        targetGr.query();
        while (targetGr.next()) {
            total += parseFloat(targetGr.getValue('annual_target_amount')) || 0;
        }
        return total;
    },

    getForecastRateCard: function(planId) {
        var rateCard = { base_rate: 0, new_business: 0, renewal: 0, expansion: 0, upsell: 0 };
        if (!planId) {
            return rateCard;
        }

        var targetGr = new GlideRecord('x_823178_commissio_plan_targets');
        targetGr.addQuery('commission_plan', planId);
        targetGr.addEncodedQuery('is_active=true^ORis_active=1');
        targetGr.query();

        while (targetGr.next()) {
            var dealType = this.resolveDealTypeForRecord(targetGr, 'deal_type_ref', '');
            var targetRate = parseFloat(targetGr.getValue('commission_rate_percent')) || 0;
            if (!dealType || targetRate <= 0) {
                continue;
            }
            rateCard[dealType] = targetRate;
        }

        // Forecast should still work when plan target rates are not populated.
        // Fall back to the lowest active tier rate per deal type.
        var tierBaseRates = this.getForecastTierBaseRates(planId);
        var tierDealTypes = Object.keys(tierBaseRates || {});
        for (var i = 0; i < tierDealTypes.length; i++) {
            var key = tierDealTypes[i];
            var current = parseFloat(rateCard[key]) || 0;
            if (current > 0) {
                continue;
            }
            var tierRate = parseFloat(tierBaseRates[key]) || 0;
            if (tierRate > 0) {
                rateCard[key] = tierRate;
            }
        }

        return rateCard;
    },

    getForecastTierBaseRates: function(planId) {
        var tierRates = {};
        if (!planId) {
            return tierRates;
        }

        var tierGr = new GlideRecord('x_823178_commissio_plan_tiers');
        tierGr.addQuery('commission_plan', planId);
        tierGr.addEncodedQuery('is_active=true^ORis_active=1');
        tierGr.query();

        while (tierGr.next()) {
            var dealType = this.resolveDealTypeForTier(tierGr, '');
            var rate = parseFloat(tierGr.getValue('commission_rate_percent')) || 0;
            var floor = parseFloat(tierGr.getValue('attainment_floor_percent'));
            if (isNaN(floor)) {
                floor = 0;
            }
            if (!dealType || rate <= 0) {
                continue;
            }

            if (!tierRates[dealType] || floor < tierRates[dealType].floor) {
                tierRates[dealType] = {
                    rate: rate,
                    floor: floor
                };
            }
        }

        var baseRates = {};
        var keys = Object.keys(tierRates);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            baseRates[key] = parseFloat(tierRates[key].rate) || 0;
        }
        return baseRates;
    },

    resolveForecastRate: function(rateCard, dealType) {
        var normalized = this.normalizeDealType(dealType);
        var direct = parseFloat(rateCard[normalized]) || 0;
        if (direct > 0) {
            return direct;
        }
        if (normalized === 'new_business') return parseFloat(rateCard.new_business) || 0;
        if (normalized === 'renewal') return parseFloat(rateCard.renewal) || 0;
        if (normalized === 'expansion') return parseFloat(rateCard.expansion) || 0;
        if (normalized === 'upsell') return parseFloat(rateCard.upsell) || 0;
        return 0;
    },

    getForecastRecognitionProjection: function(planId, closeDateValue, stage, selectedYear) {
        var closeDate = this.normalizeDateString(closeDateValue);
        var basis = this.resolveRecognitionBasisForDate(planId, closeDate, selectedYear);

        var stageLagDays = this.getForecastStageLagDays(stage);
        var invoiceLagDays = parseInt(gs.getProperty('x_823178_commissio.forecast_invoice_issue_days', '7'), 10);
        var cashLagDays = parseInt(gs.getProperty('x_823178_commissio.forecast_cash_receipt_days', '30'), 10);
        var milestoneLagDays = parseInt(gs.getProperty('x_823178_commissio.forecast_milestone_days', '14'), 10);

        if (isNaN(invoiceLagDays) || invoiceLagDays < 0) invoiceLagDays = 7;
        if (isNaN(cashLagDays) || cashLagDays < 0) cashLagDays = 30;
        if (isNaN(milestoneLagDays) || milestoneLagDays < 0) milestoneLagDays = 14;

        var recognitionDate = closeDate;
        if (basis === 'invoice_issued') {
            recognitionDate = this.addDaysToDate(closeDate, stageLagDays + invoiceLagDays);
        } else if (basis === 'booking') {
            recognitionDate = this.addDaysToDate(closeDate, stageLagDays);
        } else if (basis === 'milestone') {
            recognitionDate = this.addDaysToDate(closeDate, stageLagDays + milestoneLagDays);
        } else {
            basis = 'cash_received';
            recognitionDate = this.addDaysToDate(closeDate, stageLagDays + cashLagDays);
        }

        var payout = this.getForecastPayoutScheduleForDate(recognitionDate, basis);
        return {
            recognition_basis: basis,
            recognition_date: recognitionDate,
            payout_eligible_date: payout.payout_eligible_date,
            payout_schedule_snapshot: payout.snapshot
        };
    },

    resolveRecognitionBasisForDate: function(planId, referenceDate, selectedYear) {
        var fallback = (gs.getProperty('x_823178_commissio.default_recognition_basis', 'cash_received') || 'cash_received').toString();
        if (!planId) return fallback;

        var policyDate = this.normalizeDateString(referenceDate || (selectedYear + '-01-01'));
        var policyGr = new GlideRecord('x_823178_commissio_plan_recognition_policies');
        policyGr.addQuery('commission_plan', planId);
        policyGr.addQuery('is_active', true);
        policyGr.addQuery('effective_start_date', '<=', policyDate);
        policyGr.addNullQuery('effective_end_date').addOrCondition('effective_end_date', '>=', policyDate);
        policyGr.orderByDesc('effective_start_date');
        policyGr.orderByDesc('version_number');
        policyGr.setLimit(1);
        policyGr.query();

        if (policyGr.next()) {
            return (policyGr.getValue('recognition_basis') || fallback || 'cash_received').toString();
        }
        return fallback;
    },

    getForecastPayoutScheduleForDate: function(anchorDateValue, recognitionBasis) {
        var dateValue = this.normalizeDateString(anchorDateValue);
        var fallback = {
            payout_eligible_date: dateValue,
            snapshot: 'mode=fallback;basis=' + (recognitionBasis || 'cash_received') + ';eligible=' + dateValue
        };

        if (!dateValue) {
            return fallback;
        }

        try {
            var mode = (gs.getProperty('x_823178_commissio.payout_schedule_mode', 'cycle') || 'cycle').toLowerCase();
            if (mode === 'days') {
                var waitDays = parseInt(gs.getProperty('x_823178_commissio.payout_wait_days', '28'), 10);
                if (isNaN(waitDays) || waitDays < 0) waitDays = 28;
                var byDaysDate = this.addDaysToDate(dateValue, waitDays);
                return {
                    payout_eligible_date: byDaysDate,
                    snapshot: 'mode=days;basis=' + (recognitionBasis || 'cash_received') + ';wait_days=' + waitDays + ';eligible=' + byDaysDate
                };
            }

            var cycleDays = parseInt(gs.getProperty('x_823178_commissio.pay_cycle_days', '14'), 10);
            if (isNaN(cycleDays) || cycleDays < 1) cycleDays = 14;

            var cyclesAfterPayment = parseInt(gs.getProperty('x_823178_commissio.pay_cycles_after_payment', '2'), 10);
            if (isNaN(cyclesAfterPayment) || cyclesAfterPayment < 1) cyclesAfterPayment = 2;

            var anchorDateRaw = gs.getProperty('x_823178_commissio.pay_cycle_anchor_date', '2026-01-01') || '2026-01-01';
            var anchorDate = new GlideDateTime();
            anchorDate.setValue((anchorDateRaw.length === 10 ? anchorDateRaw + ' 00:00:00' : anchorDateRaw));

            var scheduleDate = new GlideDateTime();
            scheduleDate.setValue(dateValue + ' 00:00:00');

            var nextCycleStart = new GlideDateTime(anchorDate);
            while (!nextCycleStart.after(scheduleDate)) {
                nextCycleStart.addDaysUTC(cycleDays);
            }

            var payoutDate = new GlideDateTime(nextCycleStart);
            payoutDate.addDaysUTC((cyclesAfterPayment - 1) * cycleDays);
            var payoutDateValue = this.normalizeDateString(payoutDate.getValue());

            return {
                payout_eligible_date: payoutDateValue,
                snapshot: 'mode=cycle;basis=' + (recognitionBasis || 'cash_received') + ';cycle_days=' + cycleDays + ';cycles_after=' + cyclesAfterPayment + ';anchor=' + anchorDateRaw + ';eligible=' + payoutDateValue
            };
        } catch (e) {
            return fallback;
        }
    },

    getForecastStageLagDays: function(stage) {
        var map = {
            lead: 45,
            qualified: 30,
            proposal: 20,
            negotiation: 10,
            closed_won: 0
        };
        var key = (stage || 'proposal').toString();
        if (map.hasOwnProperty(key)) {
            return map[key];
        }
        return 20;
    },

    addDaysToDate: function(dateValue, daysToAdd) {
        var base = this.normalizeDateString(dateValue);
        if (!base) return '';
        var gdt = new GlideDateTime();
        gdt.setValue(base + ' 00:00:00');
        gdt.addDaysUTC(parseInt(daysToAdd, 10) || 0);
        return this.normalizeDateString(gdt.getValue());
    },

    normalizeDateString: function(dateValue) {
        if (!dateValue) return '';
        var str = String(dateValue);
        if (str.length >= 10) {
            return str.substring(0, 10);
        }
        return str;
    },

    getMonthKey: function(dateValue) {
        var normalized = this.normalizeDateString(dateValue);
        if (normalized.length >= 7) {
            return normalized.substring(0, 7);
        }
        return 'unknown';
    },

    toSortedTimeline: function(map) {
        var timeline = [];
        var keys = Object.keys(map || {});
        keys.sort();
        for (var i = 0; i < keys.length; i++) {
            var row = map[keys[i]];
            timeline.push({
                month: row.month,
                expected_revenue: this.round2(row.expected_revenue),
                expected_commission: this.round2(row.expected_commission),
                deal_count: row.deal_count
            });
        }
        return timeline;
    },

    toSortedWonCommissionSeries: function(map) {
        var series = [];
        var keys = Object.keys(map || {});
        keys.sort();

        for (var i = 0; i < keys.length; i++) {
            var row = map[keys[i]];
            series.push({
                month: row.month,
                total_commission: this.round2(row.total_commission),
                calculation_count: parseInt(row.calculation_count, 10) || 0
            });
        }

        return series;
    },

    resolveDominantRecognitionBasis: function(basisCounts) {
        var dominant = 'cash_received';
        var maxCount = -1;
        var keys = Object.keys(basisCounts || {});
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var count = parseInt(basisCounts[key], 10) || 0;
            if (count > maxCount) {
                maxCount = count;
                dominant = key;
            }
        }
        return dominant;
    },

    getWonRevenueYtd: function(userId, selectedYear) {
        var yearStart = selectedYear + '-01-01';
        var yearEnd = selectedYear + '-12-31';
        var total = 0;
        var dealGr = new GlideRecord('x_823178_commissio_deals');
        this.addOwnerScopeQuery(dealGr, userId);
        this.addWonDealStateQuery(dealGr);
        this.addDateRangeQuery(dealGr, 'close_date', yearStart, yearEnd);
        dealGr.query();
        while (dealGr.next()) {
            total += parseFloat(dealGr.getValue('amount')) || 0;
        }
        return total;
    },

    getWonRevenueYtdUntilDate: function(userId, selectedYear, closeDateRaw) {
        var yearStart = selectedYear + '-01-01';
        var yearEnd = selectedYear + '-12-31';
        var throughDate = closeDateRaw || yearEnd;
        if (!/^\d{4}-\d{2}-\d{2}$/.test(String(throughDate))) {
            throughDate = yearEnd;
        }

        var total = 0;
        var dealGr = new GlideRecord('x_823178_commissio_deals');
        this.addOwnerScopeQuery(dealGr, userId);
        this.addWonDealStateQuery(dealGr);
        this.addDateRangeQuery(dealGr, 'close_date', yearStart, throughDate);
        dealGr.query();
        while (dealGr.next()) {
            total += parseFloat(dealGr.getValue('amount')) || 0;
        }
        return total;
    },

    getForecastUrgencyBoost: function(closeDateValue) {
        if (!closeDateValue) return 0;
        try {
            var today = new GlideDateTime();
            var closeDate = new GlideDateTime();
            closeDate.setValue(closeDateValue + ' 00:00:00');
            var millisDiff = closeDate.getNumericValue() - today.getNumericValue();
            var days = Math.floor(millisDiff / 86400000);
            if (days <= 30) return 0.3;
            if (days <= 60) return 0.15;
            return 0;
        } catch (e) {
            return 0;
        }
    },

    addOwnerScopeQuery: function(record, userScope) {
        if (Array.isArray(userScope)) {
            if (userScope.length === 0) {
                record.addQuery('sys_id', '');
                return;
            }
            var joinedIds = userScope.join(',');
            record.addQuery('current_owner', 'IN', joinedIds).addOrCondition('owner_at_close', 'IN', joinedIds);
            return;
        }
        record.addQuery('current_owner', userScope).addOrCondition('owner_at_close', userScope);
    },

    addDateRangeQuery: function(record, fieldName, startDate, endDate) {
        record.addQuery(fieldName, '>=', startDate);
        record.addQuery(fieldName, '<=', endDate);
    },

    addOpenDealStateQuery: function(record) {
        if (!record) return;
        record.addEncodedQuery('is_won=false^ORis_wonISEMPTY');
        record.addQuery('stage', '!=', 'closed_lost');
        record.addQuery('stage', '!=', 'closed_won');
    },

    addWonDealStateQuery: function(record) {
        if (!record) return;
        record.addEncodedQuery('is_won=true^ORstage=closed_won');
    },

    getValidYear: function(yearRaw) {
        var parsed = parseInt(yearRaw, 10);
        var currentYear = parseInt(new GlideDateTime().getYearLocalTime(), 10);
        if (!isNaN(parsed) && parsed >= 2000 && parsed <= 2100) {
            return parsed;
        }
        return currentYear;
    },

    isAdminViewer: function() {
        try {
            if (typeof gs.hasRole === 'function') {
                if (gs.hasRole('x_823178_commissio.admin') || gs.hasRole('admin')) {
                    return true;
                }
            }
        } catch (e) {
            // Ignore and fall back.
        }

        return !!this.getRoleAccessContext().roles.admin;
    },

    isManagerViewer: function() {
        try {
            if (typeof gs.hasRole === 'function' && gs.hasRole('x_823178_commissio.manager')) {
                return true;
            }
        } catch (e) {
            // Ignore and fall back.
        }

        return !!this.getRoleAccessContext().roles.manager;
    },

    isFinanceViewer: function() {
        try {
            if (typeof gs.hasRole === 'function' && gs.hasRole('x_823178_commissio.finance')) {
                return true;
            }
        } catch (e) {
            // Ignore and fall back.
        }

        return !!this.getRoleAccessContext().roles.finance;
    },

    getRoleAccessContext: function() {
        var hasRole = function(roleName) {
            try {
                if (!roleName) {
                    return false;
                }

                if (typeof gs.hasRole === 'function' && gs.hasRole(roleName)) {
                    return true;
                }

                var user = gs.getUser();
                if (user && typeof user.hasRole === 'function') {
                    return !!user.hasRole(roleName);
                }
            } catch (e) {
                // Ignore and return false.
            }
            return false;
        };

        var roles = {
            admin: hasRole('x_823178_commissio.admin') || hasRole('admin'),
            manager: hasRole('x_823178_commissio.manager'),
            finance: hasRole('x_823178_commissio.finance'),
            rep: hasRole('x_823178_commissio.rep')
        };

        if (roles.admin || roles.manager || roles.finance) {
            roles.rep = true;
        }

        return {
            roles: roles,
            canSelectUsers: !!(roles.admin || roles.manager || roles.finance),
            canViewAllUsers: !!(roles.admin || roles.finance),
            canViewTeamRollup: !!(roles.admin || roles.manager),
            canReviewStatements: !!(roles.admin || roles.finance)
        };
    },

    canViewUser: function(targetUserId) {
        var viewerId = gs.getUserID();
        if (!targetUserId) return false;
        if (this.isAdminViewer()) return true;
        if (String(targetUserId) === String(viewerId)) return true;
        if (this.isManagerViewer()) {
            return this.isManagedUser(viewerId, targetUserId);
        }
        return false;
    },

    isManagedUser: function(managerUserId, targetUserId) {
        var managedIds = this.getManagedUserIds(managerUserId, false);
        for (var i = 0; i < managedIds.length; i++) {
            if (String(managedIds[i]) === String(targetUserId)) {
                return true;
            }
        }

        // Backward-compatible fallback for legacy direct-report manager linkage
        var userGr = new GlideRecord('sys_user');
        userGr.addQuery('sys_id', targetUserId);
        userGr.addQuery('manager', managerUserId);
        userGr.addActiveQuery();
        userGr.setLimit(1);
        userGr.query();
        return userGr.next();
    },

    getManagedUserIds: function(managerUserId, includeSelf) {
        var ids = [];
        var seen = {};

        if (includeSelf && managerUserId) {
            ids.push(managerUserId);
            seen[managerUserId] = true;
        }

        // Primary governance source: explicit manager-team memberships
        var today = new GlideDateTime().getValue().substring(0, 10);
        var membershipGr = new GlideRecord('x_823178_commissio_manager_team_memberships');
        membershipGr.addQuery('manager_user', managerUserId);
        membershipGr.addQuery('is_active', true);
        membershipGr.addQuery('effective_start_date', '<=', today);
        membershipGr.addNullQuery('effective_end_date').addOrCondition('effective_end_date', '>=', today);
        membershipGr.query();

        while (membershipGr.next()) {
            var repId = membershipGr.getValue('sales_rep');
            if (!repId || seen[repId]) {
                continue;
            }

            var repUser = new GlideRecord('sys_user');
            if (repUser.get(repId) && (repUser.getValue('active') === 'true' || repUser.getValue('active') === true || repUser.getValue('active') === '1')) {
                ids.push(repId);
                seen[repId] = true;
            }
        }

        // Backward-compatible fallback: direct reports where no explicit row exists
        var userGr = new GlideRecord('sys_user');
        userGr.addQuery('manager', managerUserId);
        userGr.addActiveQuery();
        userGr.query();
        while (userGr.next()) {
            var userId = userGr.getUniqueValue();
            if (userId && !seen[userId]) {
                ids.push(userId);
                seen[userId] = true;
            }
        }
        return ids;
    },

    planHasTargetConfiguration: function(planId) {
        if (!planId) return false;

        var targetGr = new GlideRecord('x_823178_commissio_plan_targets');
        targetGr.addQuery('commission_plan', planId);
        targetGr.setLimit(1);
        targetGr.query();
        return targetGr.next();
    },

    getActivePlanForUserYear: function(userId, yearStart, yearEnd) {
        if (!userId) return null;

        var firstOverlap = null;
        var overlapGr = new GlideRecord('x_823178_commissio_commission_plans');
        overlapGr.addQuery('sales_rep', userId);
        overlapGr.addQuery('is_active', true);
        if (yearStart && yearEnd) {
            overlapGr.addQuery('effective_start_date', '<=', yearEnd);
            overlapGr.addNullQuery('effective_end_date').addOrCondition('effective_end_date', '>=', yearStart);
        }
        overlapGr.orderByDesc('effective_start_date');
        overlapGr.query();
        while (overlapGr.next()) {
            if (!firstOverlap) {
                firstOverlap = overlapGr.getUniqueValue();
            }
            if (this.planHasTargetConfiguration(overlapGr.getUniqueValue())) {
                return overlapGr;
            }
        }
        if (firstOverlap) {
            var firstOverlapGr = new GlideRecord('x_823178_commissio_commission_plans');
            if (firstOverlapGr.get(firstOverlap)) return firstOverlapGr;
        }

        // Fallback: use latest active plan even if no year overlap.
        var activeFallback = new GlideRecord('x_823178_commissio_commission_plans');
        activeFallback.addQuery('sales_rep', userId);
        activeFallback.addQuery('is_active', true);
        activeFallback.orderByDesc('effective_start_date');
        activeFallback.query();
        var firstActive = null;
        while (activeFallback.next()) {
            if (!firstActive) {
                firstActive = activeFallback.getUniqueValue();
            }
            if (this.planHasTargetConfiguration(activeFallback.getUniqueValue())) {
                return activeFallback;
            }
        }
        if (firstActive) {
            var firstActiveGr = new GlideRecord('x_823178_commissio_commission_plans');
            if (firstActiveGr.get(firstActive)) return firstActiveGr;
        }

        // Last-resort fallback for migrated records where is_active was not maintained.
        var latestPlan = new GlideRecord('x_823178_commissio_commission_plans');
        latestPlan.addQuery('sales_rep', userId);
        latestPlan.orderByDesc('effective_start_date');
        latestPlan.setLimit(1);
        latestPlan.query();
        if (latestPlan.next()) return latestPlan;

        return null;
    },

    listUserIdsWithActivePlansForYear: function(selectedYear, allowedUserIds) {
        var userIds = [];
        var seen = {};

        var agg = new GlideAggregate('x_823178_commissio_commission_plans');
        agg.addQuery('is_active', true);
        // Keep rollup user scope aligned with selector behavior: active assignments, not year overlap.
        if (allowedUserIds && allowedUserIds.length > 0) {
            agg.addQuery('sales_rep', 'IN', allowedUserIds.join(','));
        } else if (allowedUserIds && allowedUserIds.length === 0) {
            return [];
        }
        agg.groupBy('sales_rep');
        agg.query();
        while (agg.next()) {
            var repId = agg.getValue('sales_rep');
            if (repId && !seen[repId]) {
                userIds.push(repId);
                seen[repId] = true;
            }
        }

        // Fallback for migrated/manual plans where is_active was not populated consistently.
        if (userIds.length === 0) {
            var anyPlanAgg = new GlideAggregate('x_823178_commissio_commission_plans');
            if (allowedUserIds && allowedUserIds.length > 0) {
                anyPlanAgg.addQuery('sales_rep', 'IN', allowedUserIds.join(','));
            } else if (allowedUserIds && allowedUserIds.length === 0) {
                return [];
            }
            anyPlanAgg.groupBy('sales_rep');
            anyPlanAgg.query();
            while (anyPlanAgg.next()) {
                var fallbackRep = anyPlanAgg.getValue('sales_rep');
                if (fallbackRep && !seen[fallbackRep]) {
                    userIds.push(fallbackRep);
                    seen[fallbackRep] = true;
                }
            }
        }
        return userIds;
    },

    listUserIdsForRollupScope: function(selectedYear, allowedUserIds) {
        var seen = {};
        var userIds = [];
        var yearStart = selectedYear + '-01-01';
        var yearEnd = selectedYear + '-12-31';

        var addIfAllowed = function(repId) {
            if (!repId) return;
            var id = String(repId);
            if (seen[id]) return;
            if (allowedUserIds && allowedUserIds.length === 0) return;
            if (allowedUserIds && allowedUserIds.length > 0 && allowedUserIds.indexOf(id) === -1) return;
            seen[id] = true;
            userIds.push(id);
        };

        var fromPlans = this.listUserIdsWithActivePlansForYear(selectedYear, allowedUserIds);
        for (var i = 0; i < fromPlans.length; i++) {
            addIfAllowed(fromPlans[i]);
        }
        if (userIds.length > 0) {
            return userIds;
        }

        var calcAgg = new GlideAggregate('x_823178_commissio_commission_calculations');
        calcAgg.addQuery('calculation_date', '>=', yearStart);
        calcAgg.addQuery('calculation_date', '<=', yearEnd);
        if (allowedUserIds && allowedUserIds.length > 0) {
            calcAgg.addQuery('sales_rep', 'IN', allowedUserIds.join(','));
        } else if (allowedUserIds && allowedUserIds.length === 0) {
            return [];
        }
        calcAgg.groupBy('sales_rep');
        calcAgg.query();
        while (calcAgg.next()) {
            addIfAllowed(calcAgg.getValue('sales_rep'));
        }
        if (userIds.length > 0) {
            return userIds;
        }

        var dealOwnerAgg = new GlideAggregate('x_823178_commissio_deals');
        dealOwnerAgg.addQuery('close_date', '>=', yearStart);
        dealOwnerAgg.addQuery('close_date', '<=', yearEnd);
        if (allowedUserIds && allowedUserIds.length > 0) {
            dealOwnerAgg.addQuery('current_owner', 'IN', allowedUserIds.join(','));
        }
        dealOwnerAgg.groupBy('current_owner');
        dealOwnerAgg.query();
        while (dealOwnerAgg.next()) {
            addIfAllowed(dealOwnerAgg.getValue('current_owner'));
        }

        var dealSnapshotAgg = new GlideAggregate('x_823178_commissio_deals');
        dealSnapshotAgg.addQuery('close_date', '>=', yearStart);
        dealSnapshotAgg.addQuery('close_date', '<=', yearEnd);
        if (allowedUserIds && allowedUserIds.length > 0) {
            dealSnapshotAgg.addQuery('owner_at_close', 'IN', allowedUserIds.join(','));
        }
        dealSnapshotAgg.groupBy('owner_at_close');
        dealSnapshotAgg.query();
        while (dealSnapshotAgg.next()) {
            addIfAllowed(dealSnapshotAgg.getValue('owner_at_close'));
        }

        return userIds;
    },

    buildAggregatePlanSummary: function(userIds, selectedYear, label) {
        if (!userIds || userIds.length === 0) return null;

        var yearStart = selectedYear + '-01-01';
        var yearEnd = selectedYear + '-12-31';
        var aggregateTargets = {};
        var totalQuota = 0;

        for (var i = 0; i < userIds.length; i++) {
            var planGr = this.getActivePlanForUserYear(userIds[i], yearStart, yearEnd);
            if (!planGr) continue;

            var details = this.getCompensationPlanDetails(planGr.getUniqueValue());
            totalQuota += parseFloat(details.total_quota) || 0;

            Object.keys(details.targets || {}).forEach(function(dealType) {
                aggregateTargets[dealType] = (aggregateTargets[dealType] || 0) + (parseFloat(details.targets[dealType]) || 0);
            });
        }

        return {
            plan_name: label || 'Rollup',
            plan_target_amount: this.round2(totalQuota),
            plan_year: selectedYear,
            sys_id: '',
            effective_start_date: selectedYear + '-01-01',
            effective_end_date: selectedYear + '-12-31',
            targets: aggregateTargets,
            tiers: [],
            bonuses: [],
            total_quota: this.round2(totalQuota),
            base_rate: 0,
            ote_at_100_percent: 0,
            ote_with_bonuses: 0,
            total_bonus_potential: 0
        };
    },

    getPlanTiersForProgress: function(planId) {
        var tiers = [];
        if (!planId) return tiers;

        var tierGr = new GlideRecord('x_823178_commissio_plan_tiers');
        tierGr.addQuery('commission_plan', planId);
        tierGr.addQuery('is_active', true);
        tierGr.orderBy('attainment_floor_percent');
        tierGr.query();

        while (tierGr.next()) {
            tiers.push({
                tier_name: tierGr.getValue('tier_name') || 'Tier',
                floor_percent: parseFloat(tierGr.getValue('attainment_floor_percent')) || 0,
                rate_percent: parseFloat(tierGr.getValue('commission_rate_percent')) || 0,
                deal_type: this.resolveDealTypeForTier(tierGr, ''),
                plan_target: tierGr.getValue('plan_target') || ''
            });
        }
        return tiers;
    },

    resolvePrimaryDealTypeForDeal: function(dealGr, cache) {
        var dealId = dealGr ? dealGr.getUniqueValue() : '';
        var fallback = this.resolveDealTypeForRecord(dealGr, 'deal_type_ref', 'other');
        if (!dealId) {
            return fallback || 'other';
        }

        var key = dealId;
        if (cache && cache[key]) {
            return cache[key];
        }

        var classificationGr = new GlideRecord('x_823178_commissio_deal_classifications');
        classificationGr.addQuery('deal', dealId);
        classificationGr.addQuery('is_active', true);
        classificationGr.orderByDesc('is_primary');
        classificationGr.orderBy('priority');
        classificationGr.orderBy('sys_created_on');
        classificationGr.setLimit(1);
        classificationGr.query();

        var resolved = fallback || 'other';
        if (classificationGr.next()) {
            resolved = this.resolveDealTypeForRecord(classificationGr, 'deal_type_ref', resolved) || resolved;
        }

        if (cache) {
            cache[key] = resolved;
        }
        return resolved;
    },

    normalizeDealType: function(value) {
        var normalized = (value || '').toString().toLowerCase();
        normalized = normalized.replace(/[\s\-]+/g, '_').replace(/__+/g, '_');
        normalized = normalized.replace(/^_+|_+$/g, '');

        var aliases = {
            seller_sourced: 'new_business',
            seller_sourced_deal: 'new_business',
            referral: 'renewal',
            referral_deal: 'renewal',
            referral_assigned: 'renewal',
            referral_deal_assigned: 'renewal'
        };

        if (aliases[normalized]) {
            return aliases[normalized];
        }

        return normalized || 'other';
    },

    isCanonicalDealType: function(value) {
        var normalized = this.normalizeDealType(value);
        return normalized === 'new_business' ||
            normalized === 'renewal' ||
            normalized === 'expansion' ||
            normalized === 'upsell' ||
            normalized === 'other';
    },

    resolvePreferredDealTypeCode: function(rawCode, rawName, fallback) {
        var normalizedCode = this.normalizeDealType(rawCode || '');
        var normalizedName = this.normalizeDealType(rawName || '');

        // If name is canonical but code is malformed/custom, trust the governed name.
        if (normalizedName && this.isCanonicalDealType(normalizedName) && !this.isCanonicalDealType(normalizedCode)) {
            return normalizedName;
        }

        if (normalizedCode) {
            return normalizedCode;
        }
        if (normalizedName) {
            return normalizedName;
        }
        return fallback ? this.normalizeDealType(fallback) : '';
    },

    resolveDealTypeForRecord: function(gr, refField, fallback) {
        var resolvedFallback = (typeof fallback === 'string') ? fallback : 'other';
        if (!gr) return resolvedFallback ? this.normalizeDealType(resolvedFallback) : '';

        var refId = gr.getValue(refField);
        if (refId) {
            var typeGr = new GlideRecord('x_823178_commissio_deal_types');
            if (typeGr.get(refId)) {
                if (this.isActiveFlag(typeGr.getValue('is_active'))) {
                    var typeCode = (typeGr.getValue('code') || '').toString();
                    var typeName = (typeGr.getValue('name') || '').toString();
                    return this.resolvePreferredDealTypeCode(typeCode, typeName, resolvedFallback);
                }
            }
        }

        // Compatibility path for migrated records where ref field value is text instead of sys_id.
        var fallbackCandidates = [];
        var seen = {};

        function addCandidate(value) {
            var raw = (value || '').toString().trim();
            if (!raw || seen[raw]) {
                return;
            }
            seen[raw] = true;
            fallbackCandidates.push(raw);
        }

        addCandidate(refId);

        try {
            addCandidate(gr.getDisplayValue(refField));
        } catch (e) {
            // Ignore display-value lookup errors.
        }

        for (var i = 0; i < fallbackCandidates.length; i++) {
            var resolvedFromText = this.resolveDealTypeFromText(fallbackCandidates[i]);
            if (resolvedFromText) {
                return resolvedFromText;
            }
        }

        return resolvedFallback ? this.normalizeDealType(resolvedFallback) : '';
    },

    resolveDealTypeFromText: function(rawValue) {
        var raw = (rawValue || '').toString().trim();
        if (!raw) {
            return '';
        }

        var normalized = this.normalizeDealType(raw);
        if (!normalized) {
            return '';
        }

        var byCode = new GlideRecord('x_823178_commissio_deal_types');
        byCode.addQuery('code', normalized);
        byCode.addEncodedQuery('is_active=true^ORis_active=1');
        byCode.setLimit(1);
        byCode.query();
        if (byCode.next()) {
            var codeValue = (byCode.getValue('code') || '').toString();
            var codeName = (byCode.getValue('name') || '').toString();
            return this.resolvePreferredDealTypeCode(codeValue, codeName, '');
        }

        var byName = new GlideRecord('x_823178_commissio_deal_types');
        byName.addQuery('name', raw);
        byName.addEncodedQuery('is_active=true^ORis_active=1');
        byName.setLimit(1);
        byName.query();
        if (byName.next()) {
            var nameCode = (byName.getValue('code') || '').toString();
            var nameValue = (byName.getValue('name') || '').toString();
            return this.resolvePreferredDealTypeCode(nameCode, nameValue, '');
        }

        // If no matching active deal type row exists yet, keep canonical values usable in dashboards.
        var canonical = {
            new_business: true,
            renewal: true,
            expansion: true,
            upsell: true,
            other: true
        };
        return canonical[normalized] ? normalized : '';
    },

    resolveDealTypeForTier: function(tierGr, fallback) {
        var resolvedFallback = (typeof fallback === 'string') ? fallback : 'other';
        if (!tierGr) return resolvedFallback ? this.normalizeDealType(resolvedFallback) : '';

        var targetId = tierGr.getValue('plan_target');
        if (!targetId) return resolvedFallback ? this.normalizeDealType(resolvedFallback) : '';

        var targetGr = new GlideRecord('x_823178_commissio_plan_targets');
        if (!targetGr.get(targetId)) return resolvedFallback ? this.normalizeDealType(resolvedFallback) : '';

        return this.resolveDealTypeForRecord(targetGr, 'deal_type_ref', resolvedFallback);
    },

    filterTiersForDealType: function(tiers, dealType) {
        if (!tiers || tiers.length === 0) return [];

        var normalizedDealType = this.normalizeDealType(dealType);
        var scoped = [];

        for (var i = 0; i < tiers.length; i++) {
            var tier = tiers[i] || {};
            var tierDealTypeRaw = (tier.deal_type || '').toString();
            if (!tierDealTypeRaw) {
                continue;
            }
            var tierDealType = this.normalizeDealType(tierDealTypeRaw);
            if (tierDealType === normalizedDealType) {
                scoped.push(tier);
            }
        }

        return scoped;
    },

    resolveTierByAttainment: function(tiers, attainmentPercent) {
        if (!tiers || tiers.length === 0) return null;

        var best = null;
        for (var i = 0; i < tiers.length; i++) {
            var floor = parseFloat(tiers[i].floor_percent || 0);
            if (attainmentPercent >= floor) {
                if (!best || floor >= parseFloat(best.floor_percent || 0)) {
                    best = tiers[i];
                }
            }
        }
        return best;
    },

    normalizeMultiplier: function(value) {
        var num = parseFloat(value);
        if (isNaN(num) || num <= 0) return 1;
        return num;
    },

    isActiveFlag: function(value) {
        if (value === true || value === 1) {
            return true;
        }

        var normalized = (value || '').toString().toLowerCase();
        return normalized === 'true' || normalized === '1';
    },

    round2: function(value) {
        return Math.round((parseFloat(value) || 0) * 100) / 100;
    },

    round4: function(value) {
        return Math.round((parseFloat(value) || 0) * 10000) / 10000;
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

    getErrorMessage: function(err) {
        if (!err) {
            return 'Unknown error';
        }

        try {
            if (typeof err.getMessage === 'function') {
                return String(err.getMessage());
            }
        } catch (ignoreGetMessage) {
            // Fall through to other formats.
        }

        if (err.message) {
            return String(err.message);
        }

        return String(err);
    },

    getErrorJSON: function(msg) {
        return JSON.stringify({
            status: 'error',
            message: msg
        });
    },

    type: 'CommissionProgressDataServiceV2'
});
        `
    }
})
