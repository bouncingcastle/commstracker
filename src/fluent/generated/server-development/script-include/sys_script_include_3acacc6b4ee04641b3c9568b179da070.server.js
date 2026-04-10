var CommissionP1Helper = Class.create();
CommissionP1Helper.prototype = Object.extendsObject(global.AbstractAjaxProcessor, {

    getForecastAndPriorities: function() {
        var userId = this.getParameter('sysparm_user_id') || gs.getUserID();
        var selectedYear = this.getValidYear(this.getParameter('sysparm_year'));
        var scenarioId = this.getParameter('sysparm_scenario_id') || '';

        try {
            var plan = this.getActivePlan(userId, selectedYear);
            var quota = this.getTotalQuota(plan ? plan.sys_id : '');
            var rateCard = this.getRateCard(plan);
            var scenario = this.getScenario(scenarioId, userId, selectedYear);

            var overrideWin = parseFloat(this.getParameter('sysparm_win_rate_multiplier') || '');
            var overridePipeline = parseFloat(this.getParameter('sysparm_pipeline_multiplier') || '');

            var winRateMultiplier = this.normalizeMultiplier(!isNaN(overrideWin) ? overrideWin : scenario.win_rate_multiplier);
            var pipelineMultiplier = this.normalizeMultiplier(!isNaN(overridePipeline) ? overridePipeline : scenario.pipeline_multiplier);

            var prioritized = [];
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
            dealsGr.addQuery('current_owner', userId).addOrCondition('owner_at_close', userId);
            dealsGr.addQuery('is_won', false);
            dealsGr.addQuery('stage', '!=', 'closed_lost');
            dealsGr.query();

            while (dealsGr.next()) {
                var amount = parseFloat(dealsGr.getValue('amount')) || 0;
                var dealType = dealsGr.getValue('deal_type') || 'new_business';
                var stage = dealsGr.getValue('stage') || 'lead';
                var rate = this.resolveRate(rateCard, dealType);
                var probability = (stageProbability[stage] || 0.3) * winRateMultiplier;
                if (probability > 1) probability = 1;

                var adjustedAmount = amount * pipelineMultiplier;
                var expectedRevenue = adjustedAmount * probability;
                var expectedCommission = expectedRevenue * (rate / 100);
                var urgencyBoost = this.getUrgencyBoost(dealsGr.getValue('close_date'));
                var score = expectedCommission * (1 + urgencyBoost);

                totals.active_deals++;
                totals.expected_revenue += expectedRevenue;
                totals.expected_commission += expectedCommission;

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
                    expected_commission: expectedCommission,
                    priority_score: score
                });
            }

            prioritized.sort(function(a, b) {
                return b.priority_score - a.priority_score;
            });

            var projectedRevenue = totals.won_revenue_ytd + totals.expected_revenue;
            var projectedAttainment = totals.total_quota > 0 ? (projectedRevenue / totals.total_quota) * 100 : 0;

            var scenarios = this.listScenariosInternal(userId, selectedYear);

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
                        projected_attainment_percent: this.round2(projectedAttainment)
                    },
                    prioritized_deals: prioritized.slice(0, 10),
                    scenarios: scenarios
                }
            });
        } catch (e) {
            gs.error('CommissionP1Helper.getForecastAndPriorities error: ' + e.message);
            return this.getErrorJSON('Unable to calculate forecast insights: ' + e.message);
        }
    },

    estimateCommission: function() {
        var userId = this.getParameter('sysparm_user_id') || gs.getUserID();
        var selectedYear = this.getValidYear(this.getParameter('sysparm_year'));
        var dealType = this.getParameter('sysparm_deal_type') || 'new_business';
        var stage = this.getParameter('sysparm_stage') || 'qualified';
        var amount = parseFloat(this.getParameter('sysparm_amount') || '0');
        var scenarioId = this.getParameter('sysparm_scenario_id') || '';

        if (!amount || amount <= 0) {
            return this.getErrorJSON('Enter an amount greater than 0 for the estimator');
        }

        try {
            var plan = this.getActivePlan(userId, selectedYear);
            var rateCard = this.getRateCard(plan);
            var rate = this.resolveRate(rateCard, dealType);
            var scenario = this.getScenario(scenarioId, userId, selectedYear);

            var probabilityByStage = {
                lead: 0.2,
                qualified: 0.4,
                proposal: 0.6,
                negotiation: 0.8,
                closed_won: 1
            };

            var probability = (probabilityByStage[stage] || 0.4) * this.normalizeMultiplier(scenario.win_rate_multiplier);
            if (probability > 1) probability = 1;

            var adjustedAmount = amount * this.normalizeMultiplier(scenario.pipeline_multiplier);
            var expectedCommission = adjustedAmount * probability * (rate / 100);

            return JSON.stringify({
                status: 'success',
                data: {
                    amount: this.round2(amount),
                    adjusted_amount: this.round2(adjustedAmount),
                    commission_rate_percent: this.round2(rate),
                    probability: this.round4(probability),
                    expected_commission: this.round2(expectedCommission),
                    scenario_name: scenario.scenario_name || ''
                }
            });
        } catch (e) {
            gs.error('CommissionP1Helper.estimateCommission error: ' + e.message);
            return this.getErrorJSON('Unable to run commission estimate: ' + e.message);
        }
    },

    saveForecastScenario: function() {
        var userId = this.getParameter('sysparm_user_id') || gs.getUserID();
        var selectedYear = this.getValidYear(this.getParameter('sysparm_year'));
        var scenarioId = this.getParameter('sysparm_scenario_id') || '';
        var scenarioName = this.getParameter('sysparm_scenario_name') || ('Scenario ' + selectedYear);
        var winRateMultiplier = this.normalizeMultiplier(parseFloat(this.getParameter('sysparm_win_rate_multiplier') || '1'));
        var pipelineMultiplier = this.normalizeMultiplier(parseFloat(this.getParameter('sysparm_pipeline_multiplier') || '1'));

        try {
            var calc = this.getForecastSummary(userId, selectedYear, winRateMultiplier, pipelineMultiplier);
            var plan = this.getActivePlan(userId, selectedYear);

            var scenarioGr = new GlideRecord('x_823178_commissio_forecast_scenarios');
            if (scenarioId && scenarioGr.get(scenarioId)) {
                // Update existing
            } else {
                scenarioGr.initialize();
                scenarioGr.setValue('sales_rep', userId);
                scenarioGr.setValue('scenario_year', selectedYear);
            }

            scenarioGr.setValue('scenario_name', scenarioName);
            if (plan && plan.sys_id) {
                scenarioGr.setValue('commission_plan', plan.sys_id);
            }
            scenarioGr.setValue('win_rate_multiplier', winRateMultiplier);
            scenarioGr.setValue('pipeline_multiplier', pipelineMultiplier);
            scenarioGr.setValue('projected_revenue', calc.expected_revenue + calc.won_revenue_ytd);
            scenarioGr.setValue('projected_commission', calc.expected_commission);
            scenarioGr.setValue('projected_attainment_percent', calc.projected_attainment_percent);
            scenarioGr.setValue('assumptions_json', JSON.stringify({
                win_rate_multiplier: winRateMultiplier,
                pipeline_multiplier: pipelineMultiplier,
                captured_on: new GlideDateTime().getDisplayValue()
            }));
            scenarioGr.setValue('status', 'draft');
            scenarioGr.setValue('is_active', true);

            var savedId = scenarioGr.getUniqueValue() ? scenarioGr.update() : scenarioGr.insert();

            return JSON.stringify({
                status: 'success',
                data: {
                    scenario_id: savedId,
                    scenario_name: scenarioName,
                    projected_commission: this.round2(calc.expected_commission),
                    projected_attainment_percent: this.round2(calc.projected_attainment_percent)
                }
            });
        } catch (e) {
            gs.error('CommissionP1Helper.saveForecastScenario error: ' + e.message);
            return this.getErrorJSON('Unable to save scenario: ' + e.message);
        }
    },

    listForecastScenarios: function() {
        var userId = this.getParameter('sysparm_user_id') || gs.getUserID();
        var selectedYear = this.getValidYear(this.getParameter('sysparm_year'));

        try {
            return JSON.stringify({
                status: 'success',
                data: this.listScenariosInternal(userId, selectedYear)
            });
        } catch (e) {
            gs.error('CommissionP1Helper.listForecastScenarios error: ' + e.message);
            return this.getErrorJSON('Unable to load scenarios: ' + e.message);
        }
    },

    submitStatementApproval: function() {
        var statementId = this.getParameter('sysparm_statement_id') || '';
        if (!statementId) {
            return this.getErrorJSON('Statement ID is required');
        }

        try {
            var statementGr = new GlideRecord('x_823178_commissio_commission_statements');
            if (!statementGr.get(statementId)) {
                return this.getErrorJSON('Statement not found');
            }

            if (!this.canSubmitStatement(statementGr)) {
                return this.getErrorJSON('Not authorized to submit this statement for approval');
            }

            var existing = new GlideRecord('x_823178_commissio_statement_approvals');
            existing.addQuery('statement', statementId);
            existing.addQuery('status', 'IN', 'submitted,in_review');
            existing.orderByDesc('sys_created_on');
            existing.setLimit(1);
            existing.query();
            if (existing.next()) {
                return JSON.stringify({
                    status: 'success',
                    data: {
                        approval_id: existing.getUniqueValue(),
                        status: existing.getValue('status'),
                        reused_existing: true
                    }
                });
            }

            var approvalGr = new GlideRecord('x_823178_commissio_statement_approvals');
            approvalGr.initialize();
            approvalGr.setValue('statement', statementId);
            approvalGr.setValue('sales_rep', statementGr.getValue('sales_rep'));
            approvalGr.setValue('status', 'submitted');
            approvalGr.setValue('current_step', 'submission');
            approvalGr.setValue('submitted_by', gs.getUserID());
            approvalGr.setValue('submitted_on', new GlideDateTime().getDisplayValue());
            approvalGr.setValue('workflow_history', new GlideDateTime().getDisplayValue() + ' | ' + gs.getUserDisplayName() + ' | created -> submitted');

            var approvalId = approvalGr.insert();

            return JSON.stringify({
                status: 'success',
                data: {
                    approval_id: approvalId,
                    status: 'submitted',
                    reused_existing: false
                }
            });
        } catch (e) {
            gs.error('CommissionP1Helper.submitStatementApproval error: ' + e.message);
            return this.getErrorJSON('Unable to submit statement approval: ' + e.message);
        }
    },

    transitionStatementApproval: function() {
        var approvalId = this.getParameter('sysparm_approval_id') || '';
        var targetStatus = this.getParameter('sysparm_target_status') || '';
        var notes = this.getParameter('sysparm_notes') || '';

        if (!approvalId || !targetStatus) {
            return this.getErrorJSON('approval_id and target_status are required');
        }

        try {
            var approvalGr = new GlideRecord('x_823178_commissio_statement_approvals');
            if (!approvalGr.get(approvalId)) {
                return this.getErrorJSON('Approval record not found');
            }

            if (!this.canTransition(targetStatus)) {
                return this.getErrorJSON('Only finance/admin can move approval to this status');
            }

            approvalGr.setValue('status', targetStatus);
            if (notes) {
                approvalGr.setValue('decision_notes', notes);
            }
            approvalGr.update();

            return JSON.stringify({
                status: 'success',
                data: {
                    approval_id: approvalId,
                    status: targetStatus
                }
            });
        } catch (e) {
            gs.error('CommissionP1Helper.transitionStatementApproval error: ' + e.message);
            return this.getErrorJSON('Unable to transition approval: ' + e.message);
        }
    },

    listStatementApprovals: function() {
        var statementId = this.getParameter('sysparm_statement_id') || '';
        var userId = this.getParameter('sysparm_user_id') || gs.getUserID();

        try {
            var approvalGr = new GlideRecord('x_823178_commissio_statement_approvals');
            if (statementId) {
                approvalGr.addQuery('statement', statementId);
            } else if (!this.userHasRole('x_823178_commissio.finance') && !this.userHasRole('x_823178_commissio.admin') && !this.userHasRole('admin')) {
                approvalGr.addQuery('sales_rep', userId);
            }
            approvalGr.orderByDesc('sys_created_on');
            approvalGr.setLimit(50);
            approvalGr.query();

            var rows = [];
            while (approvalGr.next()) {
                rows.push({
                    approval_id: approvalGr.getUniqueValue(),
                    statement: approvalGr.getValue('statement'),
                    sales_rep: approvalGr.getValue('sales_rep'),
                    status: approvalGr.getValue('status'),
                    current_step: approvalGr.getValue('current_step'),
                    submitted_on: approvalGr.getValue('submitted_on'),
                    reviewed_on: approvalGr.getValue('reviewed_on'),
                    decision_notes: approvalGr.getValue('decision_notes')
                });
            }

            return JSON.stringify({ status: 'success', data: rows });
        } catch (e) {
            gs.error('CommissionP1Helper.listStatementApprovals error: ' + e.message);
            return this.getErrorJSON('Unable to load statement approvals: ' + e.message);
        }
    },

    getForecastSummary: function(userId, selectedYear, winRateMultiplier, pipelineMultiplier) {
        var plan = this.getActivePlan(userId, selectedYear);
        var quota = this.getTotalQuota(plan ? plan.sys_id : '');
        var rateCard = this.getRateCard(plan);

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
        dealsGr.addQuery('current_owner', userId).addOrCondition('owner_at_close', userId);
        dealsGr.addQuery('is_won', false);
        dealsGr.addQuery('stage', '!=', 'closed_lost');
        dealsGr.query();

        while (dealsGr.next()) {
            var amount = parseFloat(dealsGr.getValue('amount')) || 0;
            var dealType = dealsGr.getValue('deal_type') || 'new_business';
            var stage = dealsGr.getValue('stage') || 'lead';
            var rate = this.resolveRate(rateCard, dealType);

            var probability = (stageProbability[stage] || 0.3) * winRateMultiplier;
            if (probability > 1) probability = 1;

            var adjustedAmount = amount * pipelineMultiplier;
            var rev = adjustedAmount * probability;
            expectedRevenue += rev;
            expectedCommission += rev * (rate / 100);
        }

        var wonRevenue = this.getWonRevenueYtd(userId, selectedYear);
        var projectedAttainment = quota > 0 ? ((wonRevenue + expectedRevenue) / quota) * 100 : 0;

        return {
            won_revenue_ytd: this.round2(wonRevenue),
            expected_revenue: this.round2(expectedRevenue),
            expected_commission: this.round2(expectedCommission),
            projected_attainment_percent: this.round2(projectedAttainment)
        };
    },

    listScenariosInternal: function(userId, selectedYear) {
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

    getScenario: function(scenarioId, userId, selectedYear) {
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

    getActivePlan: function(userId, selectedYear) {
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

    getTotalQuota: function(planId) {
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

    getRateCard: function(planGr) {
        if (!planGr) {
            return {
                base_rate: 0,
                new_business: 0,
                renewal: 0,
                expansion: 0,
                upsell: 0
            };
        }

        return {
            base_rate: parseFloat(planGr.getValue('base_rate')) || 0,
            new_business: parseFloat(planGr.getValue('new_business_rate')) || 0,
            renewal: parseFloat(planGr.getValue('renewal_rate')) || 0,
            expansion: parseFloat(planGr.getValue('expansion_rate')) || 0,
            upsell: parseFloat(planGr.getValue('upsell_rate')) || 0
        };
    },

    resolveRate: function(rateCard, dealType) {
        if (dealType === 'new_business') return rateCard.new_business || rateCard.base_rate;
        if (dealType === 'renewal') return rateCard.renewal || rateCard.base_rate;
        if (dealType === 'expansion') return rateCard.expansion || rateCard.base_rate;
        if (dealType === 'upsell') return rateCard.upsell || rateCard.base_rate;
        return rateCard.base_rate;
    },

    getWonRevenueYtd: function(userId, selectedYear) {
        var yearStart = selectedYear + '-01-01';
        var yearEnd = selectedYear + '-12-31';
        var total = 0;

        var dealGr = new GlideRecord('x_823178_commissio_deals');
        dealGr.addQuery('current_owner', userId).addOrCondition('owner_at_close', userId);
        dealGr.addQuery('is_won', true);
        dealGr.addQuery('close_date', '>=', yearStart);
        dealGr.addQuery('close_date', '<=', yearEnd);
        dealGr.query();

        while (dealGr.next()) {
            total += parseFloat(dealGr.getValue('amount')) || 0;
        }

        return total;
    },

    getUrgencyBoost: function(closeDateValue) {
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

    canSubmitStatement: function(statementGr) {
        var isAdmin = this.userHasRole('admin') || this.userHasRole('x_823178_commissio.admin');
        var isFinance = this.userHasRole('x_823178_commissio.finance');
        if (isAdmin || isFinance) return true;

        var isRep = this.userHasRole('x_823178_commissio.rep');
        return isRep && statementGr.getValue('sales_rep') === gs.getUserID();
    },

    canTransition: function(targetStatus) {
        if (targetStatus === 'submitted' || targetStatus === 'cancelled') {
            return true;
        }
        return this.userHasRole('admin') || this.userHasRole('x_823178_commissio.admin') || this.userHasRole('x_823178_commissio.finance');
    },

    userHasRole: function(roleName) {
        var user = gs.getUser();
        return user && user.hasRole(roleName);
    },

    getValidYear: function(yearRaw) {
        var parsed = parseInt(yearRaw, 10);
        var currentYear = parseInt(new GlideDateTime().getYearLocalTime(), 10);
        if (!isNaN(parsed) && parsed >= 2000 && parsed <= 2100) {
            return parsed;
        }
        return currentYear;
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

    getErrorJSON: function(message) {
        return JSON.stringify({
            status: 'error',
            message: message || 'Unexpected error'
        });
    },

    type: 'CommissionP1Helper'
});
