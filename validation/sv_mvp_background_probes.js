/*
SV Minimal MVP Background Probes (read-only)
Run in: System Definition > Scripts - Background

Purpose:
- Validate SV-01, SV-02, SV-03, SV-04, SV-06 using existing evidence records.
- Complement ATF + manual UI validation.

Important:
- This script does not create or update records.
- Populate CONFIG arrays with sys_ids from your test run evidence.
*/

(function executeSvMinimalMvpProbes() {
    var CONFIG = {
        plan_ids: [],
        deal_ids: [],
        payment_ids: [],
        calculation_ids: [],
        tolerance_amount: 0.01
    };

    var report = {
        run_date: new GlideDateTime().getDisplayValue(),
        suites: [],
        totals: {
            pass: 0,
            warning: 0,
            fail: 0
        }
    };

    function createSuite(id, name) {
        return {
            id: id,
            name: name,
            status: 'pass',
            checks: []
        };
    }

    function addCheck(suite, passed, severity, message, details) {
        var normalizedSeverity = severity || 'fail';
        suite.checks.push({
            passed: !!passed,
            severity: normalizedSeverity,
            message: message,
            details: details || ''
        });

        if (!passed) {
            if (normalizedSeverity === 'warning') {
                if (suite.status === 'pass') {
                    suite.status = 'warning';
                }
            } else {
                suite.status = 'fail';
            }
        }
    }

    function closeSuite(suite) {
        if (suite.status === 'pass') report.totals.pass++;
        if (suite.status === 'warning') report.totals.warning++;
        if (suite.status === 'fail') report.totals.fail++;
        report.suites.push(suite);
    }

    function toNumber(value) {
        var parsed = parseFloat(value);
        return isNaN(parsed) ? 0 : parsed;
    }

    function round2(value) {
        return Math.round(toNumber(value) * 100) / 100;
    }

    function approxEquals(left, right, tolerance) {
        var diff = Math.abs(toNumber(left) - toNumber(right));
        return diff <= (tolerance || 0.01);
    }

    function isTrue(value) {
        if (value === true || value === 1) return true;
        var s = String(value || '').toLowerCase();
        return s === 'true' || s === '1';
    }

    function getPlanTargetIds(planId) {
        var ids = [];
        var gr = new GlideRecord('x_823178_commissio_plan_targets');
        gr.addQuery('commission_plan', planId);
        gr.addQuery('is_active', true);
        gr.query();
        while (gr.next()) {
            ids.push(gr.getUniqueValue());
        }
        return ids;
    }

    function getTierBandsForTarget(targetId) {
        var rows = [];
        var gr = new GlideRecord('x_823178_commissio_plan_tiers');
        gr.addQuery('plan_target', targetId);
        gr.addQuery('is_active', true);
        gr.orderBy('attainment_floor_percent');
        gr.query();
        while (gr.next()) {
            rows.push({
                tier_id: gr.getUniqueValue(),
                floor: toNumber(gr.getValue('attainment_floor_percent')),
                ceiling: toNumber(gr.getValue('attainment_ceiling_percent')),
                rate: toNumber(gr.getValue('commission_rate_percent'))
            });
        }
        return rows;
    }

    function collectCalculationIdsFromPayments(paymentIds) {
        var ids = {};
        var out = [];
        var i;

        for (i = 0; i < paymentIds.length; i++) {
            var paymentId = paymentIds[i];
            if (!paymentId) continue;
            var paymentGr = new GlideRecord('x_823178_commissio_payments');
            if (!paymentGr.get(paymentId)) continue;
            var calcId = (paymentGr.getValue('commission_calculation_id') || '').toString();
            if (calcId && !ids[calcId]) {
                ids[calcId] = true;
                out.push(calcId);
            }
        }

        return out;
    }

    function runSV01() {
        var suite = createSuite('SV-01', 'Plan and Tier Governance');
        var i;

        if (!CONFIG.plan_ids || CONFIG.plan_ids.length === 0) {
            addCheck(suite, false, 'warning', 'No plan_ids provided; SV-01 deep checks skipped', '');
            closeSuite(suite);
            return;
        }

        for (i = 0; i < CONFIG.plan_ids.length; i++) {
            var planId = CONFIG.plan_ids[i];
            var planGr = new GlideRecord('x_823178_commissio_commission_plans');
            var planExists = planGr.get(planId);
            addCheck(suite, planExists, 'fail', 'Plan exists', 'plan_id=' + planId);
            if (!planExists) continue;

            var targetIds = getPlanTargetIds(planId);
            addCheck(suite, targetIds.length > 0, 'fail', 'Plan has active targets', 'plan_id=' + planId + '; target_count=' + targetIds.length);

            var t;
            for (t = 0; t < targetIds.length; t++) {
                var targetId = targetIds[t];
                var bands = getTierBandsForTarget(targetId);
                addCheck(suite, bands.length > 0, 'fail', 'Target has active tiers', 'target_id=' + targetId + '; tier_count=' + bands.length);
                if (bands.length === 0) continue;

                var firstStartsAtZero = approxEquals(bands[0].floor, 0, 0.0001);
                addCheck(suite, firstStartsAtZero, 'fail', 'Tier bands start at 0 floor', 'target_id=' + targetId + '; first_floor=' + bands[0].floor);

                var j;
                for (j = 0; j < bands.length; j++) {
                    var row = bands[j];
                    var validCeiling = row.ceiling > row.floor;
                    addCheck(suite, validCeiling, 'fail', 'Tier ceiling greater than floor', 'tier_id=' + row.tier_id + '; floor=' + row.floor + '; ceiling=' + row.ceiling);

                    if (j > 0) {
                        var contiguous = approxEquals(bands[j - 1].ceiling, row.floor, 0.0001);
                        addCheck(
                            suite,
                            contiguous,
                            'fail',
                            'Tier bands contiguous with no gaps',
                            'target_id=' + targetId + '; prev_ceiling=' + bands[j - 1].ceiling + '; floor=' + row.floor
                        );
                    }
                }
            }
        }

        closeSuite(suite);
    }

    function runSV02() {
        var suite = createSuite('SV-02', 'Snapshot Immutability');
        var i;

        if (!CONFIG.deal_ids || CONFIG.deal_ids.length === 0) {
            addCheck(suite, false, 'warning', 'No deal_ids provided; SV-02 deep checks skipped', '');
            closeSuite(suite);
            return;
        }

        for (i = 0; i < CONFIG.deal_ids.length; i++) {
            var dealId = CONFIG.deal_ids[i];
            var dealGr = new GlideRecord('x_823178_commissio_deals');
            var dealExists = dealGr.get(dealId);
            addCheck(suite, dealExists, 'fail', 'Deal exists', 'deal_id=' + dealId);
            if (!dealExists) continue;

            addCheck(suite, (dealGr.getValue('stage') || '') === 'closed_won', 'warning', 'Deal stage is closed_won for snapshot validation', 'deal_id=' + dealId + '; stage=' + dealGr.getValue('stage'));
            addCheck(suite, isTrue(dealGr.getValue('snapshot_taken')), 'fail', 'Snapshot taken flag is true', 'deal_id=' + dealId);
            addCheck(suite, !!dealGr.getValue('snapshot_timestamp'), 'fail', 'Snapshot timestamp is populated', 'deal_id=' + dealId);
            addCheck(suite, isTrue(dealGr.getValue('snapshot_immutable')), 'fail', 'Snapshot immutable flag is true', 'deal_id=' + dealId);
            addCheck(suite, !!dealGr.getValue('owner_at_close'), 'fail', 'Owner at close is populated', 'deal_id=' + dealId);
        }

        closeSuite(suite);
    }

    function runSV03() {
        var suite = createSuite('SV-03', 'Payment-Driven Commission Runtime');
        var i;

        if (!CONFIG.payment_ids || CONFIG.payment_ids.length === 0) {
            addCheck(suite, false, 'warning', 'No payment_ids provided; SV-03 deep checks skipped', '');
            closeSuite(suite);
            return;
        }

        for (i = 0; i < CONFIG.payment_ids.length; i++) {
            var paymentId = CONFIG.payment_ids[i];
            var paymentGr = new GlideRecord('x_823178_commissio_payments');
            var paymentExists = paymentGr.get(paymentId);
            addCheck(suite, paymentExists, 'fail', 'Payment exists', 'payment_id=' + paymentId);
            if (!paymentExists) continue;

            var calcState = (paymentGr.getValue('commission_calculated') || '').toString();
            var calcId = (paymentGr.getValue('commission_calculation_id') || '').toString();
            addCheck(suite, !!calcState, 'fail', 'Payment has commission state', 'payment_id=' + paymentId + '; state=' + calcState);

            if (calcState === 'calculated') {
                addCheck(suite, !!calcId, 'fail', 'Calculated payment has calculation link', 'payment_id=' + paymentId);
            } else {
                addCheck(suite, true, 'warning', 'Payment is not in calculated state', 'payment_id=' + paymentId + '; state=' + calcState);
                continue;
            }

            var calcGr = new GlideRecord('x_823178_commissio_commission_calculations');
            var calcExists = calcGr.get(calcId);
            addCheck(suite, calcExists, 'fail', 'Linked calculation exists', 'calc_id=' + calcId);
            if (!calcExists) continue;

            var invoiceGr = new GlideRecord('x_823178_commissio_invoices');
            var invoiceExists = invoiceGr.get(paymentGr.getValue('invoice'));
            addCheck(suite, invoiceExists, 'fail', 'Linked invoice exists', 'payment_id=' + paymentId);
            if (!invoiceExists) continue;

            var invoiceSubtotal = toNumber(invoiceGr.getValue('subtotal'));
            var invoiceTotal = toNumber(invoiceGr.getValue('total_amount'));
            var paymentAmount = toNumber(paymentGr.getValue('payment_amount'));
            var expectedRatio = invoiceTotal > 0 ? Math.min(Math.abs(paymentAmount) / invoiceTotal, 1.0) : 0;
            var expectedBase = round2(invoiceSubtotal * expectedRatio);
            var actualBase = toNumber(calcGr.getValue('commission_base_amount'));
            addCheck(
                suite,
                approxEquals(actualBase, expectedBase, CONFIG.tolerance_amount),
                'fail',
                'Commission base matches subtotal-proration formula',
                'payment_id=' + paymentId + '; expected_base=' + expectedBase + '; actual_base=' + actualBase
            );

            var isRefund = (paymentGr.getValue('payment_type') || '') === 'refund' || paymentAmount < 0;
            var calcAmount = toNumber(calcGr.getValue('commission_amount'));
            if (isRefund) {
                addCheck(suite, calcAmount < 0, 'fail', 'Refund yields negative commission', 'payment_id=' + paymentId + '; commission_amount=' + calcAmount);
            } else {
                addCheck(suite, calcAmount >= 0, 'warning', 'Non-refund commission is non-negative', 'payment_id=' + paymentId + '; commission_amount=' + calcAmount);
            }
        }

        closeSuite(suite);
    }

    function runSV04() {
        var suite = createSuite('SV-04', 'Deterministic Rate + Marginal Explainability');
        var calcIds = [];
        var seen = {};
        var i;

        if (CONFIG.calculation_ids && CONFIG.calculation_ids.length > 0) {
            for (i = 0; i < CONFIG.calculation_ids.length; i++) {
                var c = CONFIG.calculation_ids[i];
                if (c && !seen[c]) {
                    seen[c] = true;
                    calcIds.push(c);
                }
            }
        }

        var derived = collectCalculationIdsFromPayments(CONFIG.payment_ids || []);
        for (i = 0; i < derived.length; i++) {
            if (!seen[derived[i]]) {
                seen[derived[i]] = true;
                calcIds.push(derived[i]);
            }
        }

        if (calcIds.length === 0) {
            addCheck(suite, false, 'warning', 'No calculation_ids available; SV-04 deep checks skipped', '');
            closeSuite(suite);
            return;
        }

        for (i = 0; i < calcIds.length; i++) {
            var calcId = calcIds[i];
            var calcGr = new GlideRecord('x_823178_commissio_commission_calculations');
            var calcExists = calcGr.get(calcId);
            addCheck(suite, calcExists, 'fail', 'Calculation exists', 'calc_id=' + calcId);
            if (!calcExists) continue;

            var baseComponent = toNumber(calcGr.getValue('base_commission_component'));
            var accelComponent = toNumber(calcGr.getValue('accelerator_delta_component'));
            var bonusComponent = toNumber(calcGr.getValue('bonus_component'));
            var totalAmount = toNumber(calcGr.getValue('commission_amount'));
            var expectedTotal = round2(baseComponent + accelComponent + bonusComponent);
            addCheck(
                suite,
                approxEquals(totalAmount, expectedTotal, CONFIG.tolerance_amount),
                'fail',
                'Explainability components reconcile to commission total',
                'calc_id=' + calcId + '; expected_total=' + expectedTotal + '; total=' + totalAmount
            );

            var rawInputs = (calcGr.getValue('calculation_inputs') || '').toString();
            if (!rawInputs) {
                addCheck(suite, false, 'fail', 'Calculation inputs JSON is present', 'calc_id=' + calcId);
                continue;
            }

            var parsed = null;
            try {
                parsed = JSON.parse(rawInputs);
            } catch (e) {
                addCheck(suite, false, 'fail', 'Calculation inputs JSON parses', 'calc_id=' + calcId + '; error=' + e.message);
                continue;
            }

            addCheck(
                suite,
                (parsed.rateSelectionModel || '') === 'highest_applicable_classification',
                'fail',
                'Rate selection model is highest_applicable_classification',
                'calc_id=' + calcId + '; model=' + parsed.rateSelectionModel
            );

            addCheck(
                suite,
                (parsed.payoutComputationMode || '') === 'marginal_tier_bands',
                'fail',
                'Payout computation mode is marginal_tier_bands',
                'calc_id=' + calcId + '; mode=' + parsed.payoutComputationMode
            );

            addCheck(
                suite,
                !!(parsed.rateEvaluations && parsed.rateEvaluations.length),
                'warning',
                'Rate evaluations are present in calculation inputs',
                'calc_id=' + calcId
            );
        }

        closeSuite(suite);
    }

    function runSV06() {
        var suite = createSuite('SV-06', 'Exception, Duplicate, Reconciliation Controls');

        var duplicatePaymentCount = 0;
        var paymentDupGr = new GlideRecord('x_823178_commissio_payments');
        paymentDupGr.groupBy('books_payment_id');
        paymentDupGr.addAggregate('COUNT');
        paymentDupGr.addHaving('COUNT', '>', 1);
        paymentDupGr.query();
        while (paymentDupGr.next()) {
            duplicatePaymentCount++;
        }
        addCheck(suite, duplicatePaymentCount === 0, 'fail', 'No duplicate Books payment IDs', 'duplicate_groups=' + duplicatePaymentCount);

        var duplicateCalcCount = 0;
        var calcDupGr = new GlideRecord('x_823178_commissio_commission_calculations');
        calcDupGr.groupBy('payment');
        calcDupGr.addAggregate('COUNT');
        calcDupGr.addHaving('COUNT', '>', 1);
        calcDupGr.query();
        while (calcDupGr.next()) {
            duplicateCalcCount++;
        }
        addCheck(suite, duplicateCalcCount === 0, 'fail', 'No duplicate calculations per payment', 'duplicate_groups=' + duplicateCalcCount);

        var orphanCount = 0;
        var orphanGr = new GlideRecord('x_823178_commissio_commission_calculations');
        orphanGr.addNullQuery('payment');
        orphanGr.query();
        while (orphanGr.next()) {
            orphanCount++;
        }

        orphanGr = new GlideRecord('x_823178_commissio_commission_calculations');
        orphanGr.addNullQuery('deal');
        orphanGr.query();
        while (orphanGr.next()) {
            orphanCount++;
        }

        orphanGr = new GlideRecord('x_823178_commissio_commission_calculations');
        orphanGr.addNullQuery('sales_rep');
        orphanGr.query();
        while (orphanGr.next()) {
            orphanCount++;
        }
        addCheck(suite, orphanCount === 0, 'warning', 'No orphaned calculation references', 'orphan_hits=' + orphanCount);

        var reconGr = new GlideRecord('x_823178_commissio_reconciliation_log');
        reconGr.orderByDesc('reconciliation_date');
        reconGr.setLimit(1);
        reconGr.query();
        if (reconGr.next()) {
            var reconStatus = (reconGr.getValue('status') || '').toString();
            addCheck(suite, true, 'warning', 'Latest reconciliation entry found', 'recon_id=' + reconGr.getUniqueValue() + '; status=' + reconStatus);
            addCheck(suite, reconStatus !== 'failed', 'warning', 'Latest reconciliation status is not failed', 'status=' + reconStatus);
        } else {
            addCheck(suite, false, 'warning', 'No reconciliation log entry found', '');
        }

        var openHighAlerts = 0;
        var alertGr = new GlideRecord('x_823178_commissio_system_alerts');
        alertGr.addQuery('status', 'IN', 'open,acknowledged');
        alertGr.addQuery('severity', 'IN', 'high,critical');
        alertGr.query();
        while (alertGr.next()) {
            openHighAlerts++;
        }
        addCheck(suite, openHighAlerts === 0, 'warning', 'No open high/critical system alerts', 'open_high_alerts=' + openHighAlerts);

        closeSuite(suite);
    }

    runSV01();
    runSV02();
    runSV03();
    runSV04();
    runSV06();

    gs.info('SV_MVP_PROBE_REPORT=' + JSON.stringify(report));
})();
