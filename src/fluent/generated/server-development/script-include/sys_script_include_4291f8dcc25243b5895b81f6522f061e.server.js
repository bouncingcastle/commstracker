
    var resolveCommissionRoleAccess = Symbol(CallExpressionShape);
    var CommissionProgressDataService = Class.create();
    CommissionProgressDataService.prototype = Object.extendsObject(global.AbstractAjaxProcessor, {
    
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

            var selectedUserIds = [];
            if (includeAllUsers) {
                selectedUserIds = this.listUserIdsWithActivePlansForYear(selectedYear, null);
                result.data.view_mode = 'all_users';
                result.data.selected_user_count = selectedUserIds.length;
            } else if (includeTeamUsers) {
                var managerScopeIds = this.getManagedUserIds(currentViewerId, true);
                selectedUserIds = this.listUserIdsWithActivePlansForYear(selectedYear, managerScopeIds);
                result.data.view_mode = 'team_rollup';
                result.data.selected_user_count = selectedUserIds.length;
            }

            var planId = '';
            if (!includeAllUsers && !includeTeamUsers) {
                var planGr = new GlideRecord('x_823178_commissio_commission_plans');
                planGr.addQuery('sales_rep', userId);
                planGr.addQuery('is_active', true);
                planGr.addQuery('effective_start_date', '<=', yearEnd);
                planGr.addNullQuery('effective_end_date').addOrCondition('effective_end_date', '>=', yearStart);
                planGr.orderByDesc('effective_start_date');
                planGr.query();

                if (planGr.next()) {
                    var planYearStr = planGr.getValue('effective_start_date');
                    var planYear = planYearStr ? new GlideDateTime(planYearStr).getYearLocalTime() : selectedYear;
                    planId = planGr.getValue('sys_id');
                    
                    var compDetails = this.getCompensationPlanDetails(planId);
                    var baseRate = compDetails.base_rate;
                    var totalQuota = compDetails.total_quota;
                    var oTE100 = totalQuota > 0 ? (totalQuota * baseRate / 100) : 0;
                    var oteWithBonuses = oTE100 + compDetails.total_bonus_potential;
                    var resolvedPlanTarget = totalQuota > 0 ? totalQuota : (parseFloat(planGr.getValue('plan_target_amount')) || 0);
                    
                    result.data.active_plan = {
                        plan_name: planGr.getValue('plan_name'),
                        plan_target_amount: resolvedPlanTarget,
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
            var breakdown = { 'new_business': 0, 'renewal': 0, 'expansion': 0, 'upsell': 0, 'other': 0 };
            var recentCalcs = [];

            while (calcGr.next()) {
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

                var explainability = this.getExplainabilityComponentsFromCalc(calcGr);
                totalBaseComponent += explainability.base_component;
                totalAcceleratorDelta += explainability.accelerator_component;
                totalBonusComponent += explainability.bonus_component;

                if (breakdown.hasOwnProperty(dealType)) {
                    breakdown[dealType] += commAmount;
                } else {
                    breakdown.other += commAmount;
                }

                if (recentCalcs.length < 10) {
                    var calcDealGr = new GlideRecord('x_823178_commissio_deals');
                    calcDealGr.get(calcGr.getValue('deal'));

                    var repName = '';
                    if (includeAllUsers) {
                        var repGr = new GlideRecord('sys_user');
                        if (repGr.get(calcGr.getValue('sales_rep'))) {
                            repName = repGr.getDisplayValue('name') || '';
                        }
                    }
                    
                    recentCalcs.push({
                        sales_rep_name: repName,
                        deal_name: calcDealGr.getDisplayValue('deal_name'),
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
            dealGr.addQuery('is_won', false);
            dealGr.addQuery('stage', '!=', 'closed_lost');
            dealGr.orderBy('close_date');
            dealGr.query();

            var activeDeals = [];
            var pipelineValue = 0;
            var dealBreakdown = { 'new_business': 0, 'renewal': 0, 'expansion': 0, 'upsell': 0, 'other': 0 };
            var dealCount = 0;
            var activeDealTypeCache = {};

            while (dealGr.next() && dealCount < 50) {
                var dealAmount = parseFloat(dealGr.getValue('amount')) || 0;
                var dealType2 = this.resolvePrimaryDealTypeForDeal(dealGr, activeDealTypeCache);

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
                    result.data.quota_progress = this.getQuotaProgress(userId, planId, selectedYear);
                } catch (quotaErr) {
                    gs.log('CommissionProgressDataService quota fetch warning: ' + quotaErr.getMessage(), 'CommissionProgressDataService');
                }
            } else if ((includeAllUsers || includeTeamUsers) && result.data.active_plan && result.data.active_plan.targets) {
                try {
                    result.data.quota_progress = this.getAggregateQuotaProgress(selectedUserIds, result.data.active_plan.targets, selectedYear);
                } catch (aggregateQuotaErr) {
                    gs.log('CommissionProgressDataService aggregate quota warning: ' + aggregateQuotaErr.getMessage(), 'CommissionProgressDataService');
                }
            }

            return JSON.stringify(result);

        } catch (e) {
            gs.error('CommissionProgressDataService.getRepProgress error: ' + e.getMessage());
            return this.getErrorJSON('Error fetching commission progress: ' + e.getMessage());
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
                var dt = this.normalizeDealType(targetGr.getValue('deal_type'));
                targets[dt] = parseFloat(targetGr.getValue('annual_target_amount')) || 0;
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
            dealGr.addQuery('is_won', true);
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
            gs.error('CommissionProgressDataService.getQuotaProgress error: ' + e.getMessage());
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
        dealGr.addQuery('is_won', true);
        this.addDateRangeQuery(dealGr, 'close_date', yearStart, yearEnd);
        dealGr.query();

        var dealTypeCache = {};

        while (dealGr.next()) {
            var dt = this.resolvePrimaryDealTypeForDeal(dealGr, dealTypeCache);
            var amount = parseFloat(dealGr.getValue('amount')) || 0;
            achieved[dt] = (achieved[dt] || 0) + amount;
        }

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
            gs.error('CommissionProgressDataService.getCurrentUser error: ' + e.getMessage());
            return this.getErrorJSON('Unable to resolve current user: ' + e.getMessage());
        }
    },

    getViewerAccess: function() {
        try {
            var access = this.getRoleAccessContext();

            return JSON.stringify({
                status: 'success',
                data: {
                    can_select_users: !!access.canSelectUsers,
                    can_view_all_users: !!access.canViewAllUsers,
                    can_view_team_rollup: !!access.canViewTeamRollup,
                    manager_scope_count: access.roles.manager ? this.getManagedUserIds(gs.getUserID(), false).length : 0,
                    roles: access.roles
                }
            });
        } catch (e) {
            gs.error('CommissionProgressDataService.getViewerAccess error: ' + e.getMessage());
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
            gs.error('CommissionProgressDataService.getYearContext error: ' + e.getMessage());
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
            gs.error('CommissionProgressDataService.getDashboardMetrics error: ' + e.getMessage());
            return this.getErrorJSON('Unable to load dashboard metrics: ' + e.getMessage());
        }
    },

    listUsersWithData: function() {
        try {
            var users = [];
            var seen = {};
            var isAdmin = this.isAdminViewer();
            var isManager = this.isManagerViewer();
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
            if (selectedYear) {
                planAgg.addQuery('effective_start_date', '<=', yearEnd);
                planAgg.addNullQuery('effective_end_date').addOrCondition('effective_end_date', '>=', yearStart);
            }
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
            gs.error('CommissionProgressDataService.listUsersWithData error: ' + e.getMessage());
            return this.getErrorJSON('Unable to load users: ' + e.getMessage());
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
            gs.error('CommissionProgressDataService.searchUsers error: ' + e.getMessage());
            return this.getErrorJSON('Error searching users: ' + e.getMessage());
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
            gs.error('CommissionProgressDataService.getStatementExplainability error: ' + e.getMessage());
            return this.getErrorJSON('Unable to load statement explainability: ' + e.getMessage());
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
                deal_type: calcGr.getValue('deal_type') || 'other',
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
                total_bonus_potential: 0
            };

            if (!planId) return details;

            var targetGr = new GlideRecord('x_823178_commissio_plan_targets');
            targetGr.addQuery('commission_plan', planId);
            targetGr.orderBy('deal_type');
            targetGr.query();

            while (targetGr.next()) {
                var dealType = this.normalizeDealType(targetGr.getValue('deal_type'));
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
                    rate_percent: rate,
                    deal_type: this.normalizeDealType(tierGr.getValue('deal_type') || 'all')
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
                    deal_type: this.normalizeDealType(bonusGr.getValue('deal_type') || 'any'),
                    is_discretionary: bonusGr.getValue('is_discretionary') === '1' || bonusGr.getValue('is_discretionary') === true
                });
            }

            return details;
        } catch (e) {
            gs.error('CommissionProgressDataService.getCompensationPlanDetails error: ' + e.getMessage());
            return { targets: {}, tiers: [], bonuses: [], total_quota: 0, base_rate: 0, total_bonus_potential: 0 };
        }
    },

    getForecastAndPriorities: function() {
        var userId = this.getParameter('sysparm_user_id') || gs.getUserID();
        var selectedYear = this.getValidYear(this.getParameter('sysparm_year'));
        var scenarioId = this.getParameter('sysparm_scenario_id') || '';

        try {
            var plan = this.getForecastPlan(userId, selectedYear);
            var quota = this.getForecastTotalQuota(plan ? plan.sys_id : '');
            var rateCard = this.getForecastRateCard(plan);
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
            dealsGr.addQuery('is_won', false);
            dealsGr.addQuery('stage', '!=', 'closed_lost');
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
                var recognitionProjection = this.getForecastRecognitionProjection(plan ? plan.getUniqueValue() : '', dealsGr.getValue('close_date'), stage, selectedYear);
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
            gs.error('CommissionProgressDataService.getForecastAndPriorities error: ' + e.getMessage());
            return this.getErrorJSON('Unable to calculate forecast insights');
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
            var rateCard = this.getForecastRateCard(plan);
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
            gs.error('CommissionProgressDataService.estimateCommission error: ' + e.getMessage());
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
            gs.error('CommissionProgressDataService.saveForecastScenario error: ' + e.getMessage());
            return this.getErrorJSON('Unable to save scenario');
        }
    },

    getForecastSummaryValues: function(userId, selectedYear, winRateMultiplier, pipelineMultiplier) {
        var plan = this.getForecastPlan(userId, selectedYear);
        var quota = this.getForecastTotalQuota(plan ? plan.sys_id : '');
        var rateCard = this.getForecastRateCard(plan);

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
        dealsGr.addQuery('is_won', false);
        dealsGr.addQuery('stage', '!=', 'closed_lost');
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
        var planGr = new GlideRecord('x_823178_commissio_commission_plans');
        planGr.addQuery('sales_rep', userId);
        planGr.addQuery('is_active', true);
        planGr.addQuery('effective_start_date', '<=', yearEnd);
        planGr.addNullQuery('effective_end_date').addOrCondition('effective_end_date', '>=', yearStart);
        planGr.orderByDesc('effective_start_date');
        planGr.setLimit(1);
        planGr.query();
        if (!planGr.next()) return null;
        return planGr;
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

    getForecastRateCard: function(planGr) {
        if (!planGr) {
            return { base_rate: 0, new_business: 0, renewal: 0, expansion: 0, upsell: 0 };
        }
        return {
            base_rate: parseFloat(planGr.getValue('base_rate')) || 0,
            new_business: parseFloat(planGr.getValue('new_business_rate')) || 0,
            renewal: parseFloat(planGr.getValue('renewal_rate')) || 0,
            expansion: parseFloat(planGr.getValue('expansion_rate')) || 0,
            upsell: parseFloat(planGr.getValue('upsell_rate')) || 0
        };
    },

    resolveForecastRate: function(rateCard, dealType) {
        var normalized = this.normalizeDealType(dealType);
        if (normalized === 'new_business') return rateCard.new_business || rateCard.base_rate;
        if (normalized === 'renewal') return rateCard.renewal || rateCard.base_rate;
        if (normalized === 'expansion') return rateCard.expansion || rateCard.base_rate;
        if (normalized === 'upsell') return rateCard.upsell || rateCard.base_rate;
        return rateCard.base_rate;
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
        dealGr.addQuery('is_won', true);
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
        if (!/^d{4}-d{2}-d{2}$/.test(String(throughDate))) {
            throughDate = yearEnd;
        }

        var total = 0;
        var dealGr = new GlideRecord('x_823178_commissio_deals');
        this.addOwnerScopeQuery(dealGr, userId);
        dealGr.addQuery('is_won', true);
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

    getValidYear: function(yearRaw) {
        var parsed = parseInt(yearRaw, 10);
        var currentYear = parseInt(new GlideDateTime().getYearLocalTime(), 10);
        if (!isNaN(parsed) && parsed >= 2000 && parsed <= 2100) {
            return parsed;
        }
        return currentYear;
    },

    isAdminViewer: function() {
        return !!this.getRoleAccessContext().roles.admin;
    },

    isManagerViewer: function() {
        return !!this.getRoleAccessContext().roles.manager;
    },

    isFinanceViewer: function() {
        return !!this.getRoleAccessContext().roles.finance;
    },

    getRoleAccessContext: function() {
        return resolveCommissionRoleAccess(gs.getUser());
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

    listUserIdsWithActivePlansForYear: function(selectedYear, allowedUserIds) {
        var yearStart = selectedYear + '-01-01';
        var yearEnd = selectedYear + '-12-31';
        var userIds = [];

        var agg = new GlideAggregate('x_823178_commissio_commission_plans');
        agg.addQuery('is_active', true);
        agg.addQuery('effective_start_date', '<=', yearEnd);
        agg.addNullQuery('effective_end_date').addOrCondition('effective_end_date', '>=', yearStart);
        if (allowedUserIds && allowedUserIds.length > 0) {
            agg.addQuery('sales_rep', 'IN', allowedUserIds.join(','));
        } else if (allowedUserIds && allowedUserIds.length === 0) {
            return [];
        }
        agg.groupBy('sales_rep');
        agg.query();
        while (agg.next()) {
            var repId = agg.getValue('sales_rep');
            if (repId) userIds.push(repId);
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
            var planGr = new GlideRecord('x_823178_commissio_commission_plans');
            planGr.addQuery('sales_rep', userIds[i]);
            planGr.addQuery('is_active', true);
            planGr.addQuery('effective_start_date', '<=', yearEnd);
            planGr.addNullQuery('effective_end_date').addOrCondition('effective_end_date', '>=', yearStart);
            planGr.orderByDesc('effective_start_date');
            planGr.setLimit(1);
            planGr.query();
            if (!planGr.next()) continue;

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
                deal_type: this.normalizeDealType(tierGr.getValue('deal_type'))
            });
        }
        return tiers;
    },

    resolvePrimaryDealTypeForDeal: function(dealGr, cache) {
        var dealId = dealGr ? dealGr.getUniqueValue() : '';
        var fallback = this.normalizeDealType(dealGr ? dealGr.getValue('deal_type') : 'other');
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
            resolved = this.normalizeDealType(classificationGr.getValue('deal_type')) || resolved;
        }

        if (cache) {
            cache[key] = resolved;
        }
        return resolved;
    },

    normalizeDealType: function(value) {
        return (Symbol(CallExpressionShape))(value, 'other');
    },

    filterTiersForDealType: function(tiers, dealType) {
        if (!tiers || tiers.length === 0) return [];

        var normalizedDealType = this.normalizeDealType(dealType);
        var scoped = [];

        for (var i = 0; i < tiers.length; i++) {
            var tier = tiers[i] || {};
            var tierDealType = this.normalizeDealType(tier.deal_type || 'all');
            if (tierDealType === 'all' || tierDealType === '' || tierDealType === normalizedDealType) {
                scoped.push(tier);
            }
        }

        return scoped.length > 0 ? scoped : tiers;
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

    getErrorJSON: function(msg) {
        return JSON.stringify({
            status: 'error',
            message: msg
        });
    },

    type: 'CommissionProgressDataService'
});
        