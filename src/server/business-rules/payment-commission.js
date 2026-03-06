import { gs, GlideRecord, GlideDateTime } from '@servicenow/glide'
import { normalizeDealType as normalizeDealTypeCanonical } from '../script-includes/deal-type-normalizer.js'
import { getApprovedOverrideJustification } from '../script-includes/ops-governance-utils.js'
import { PAYMENT_CALC_STATE, CALC_STATUS } from '../script-includes/status-model.js'

export function calculateCommissionOnPayment(current, previous) {
    // BUSINESS REQUIREMENT: Prevent duplicate calculations but allow legitimate recalculations
    if (current.getValue('commission_calculated') === PAYMENT_CALC_STATE.CALCULATED && !shouldRecalculate(current)) {
        return; // Already calculated and no recalculation needed
    }
    
    // BUSINESS REQUIREMENT: Enhanced lock management to prevent processing delays
    var lockTimeout = parseInt(gs.getProperty('x_823178_commissio.calculation_timeout_minutes', '5'));
    var calcLockGr = new GlideRecord('x_823178_commissio_commission_calculations');
    calcLockGr.addQuery('payment', current.sys_id);
    calcLockGr.addQuery('sys_created_on', '>', gs.minutesAgoStart(lockTimeout));
    calcLockGr.query();
    
    if (calcLockGr.next()) {
        gs.warn('Commission Management: Recent calculation exists for payment ' + current.getValue('books_payment_id'));
        // Check if it's stuck - if so, allow override
        var stuckThreshold = lockTimeout * 2; // Double the normal timeout
        var stuckCheck = new GlideRecord('x_823178_commissio_commission_calculations');
        stuckCheck.addQuery('payment', current.sys_id);
        stuckCheck.addQuery('sys_created_on', '>', gs.minutesAgoStart(stuckThreshold));
        stuckCheck.query();
        
        if (stuckCheck.next()) {
            gs.info('Commission Management: Calculation lock expired, proceeding with processing');
        } else {
            return; // Still within reasonable processing time
        }
    }
    
    if (!current.getValue('payment_date') || !current.getValue('invoice')) {
        gs.warn('Commission Management: Cannot calculate commission - missing payment date or invoice');
        return;
    }
    
    // Set calculation lock
    current.setValue('calculation_lock', true);
    current.setValue('calculation_lock_timestamp', new GlideDateTime().getDisplayValue());
    
    gs.info('Commission Management: Calculating commission for payment ' + current.getValue('books_payment_id'));
    
    try {
        // Get invoice details with validation
        var invoiceGr = new GlideRecord('x_823178_commissio_invoices');
        if (!invoiceGr.get(current.getValue('invoice'))) {
            gs.error('Commission Management: Invoice not found');
            current.setValue('commission_calculated', PAYMENT_CALC_STATE.ERROR);
            return;
        }
        
        // Get deal details with validation
        var dealGr = new GlideRecord('x_823178_commissio_deals');
        if (!dealGr.get(invoiceGr.getValue('deal'))) {
            gs.error('Commission Management: Deal not found for invoice');
            current.setValue('commission_calculated', PAYMENT_CALC_STATE.ERROR);
            return;
        }

        var dealTypeRef = (dealGr.getValue('deal_type_ref') || '').toString();
        var dealTypeCode = resolveDealTypeCodeFromReference(dealTypeRef);
        if (!dealTypeCode) {
            gs.error('Commission Management: Deal requires an active Deal Type reference for commission calculation');
            current.setValue('commission_calculated', PAYMENT_CALC_STATE.ERROR);
            return;
        }
        
        // BUSINESS REQUIREMENT: Deal must be properly closed, but allow processing of approved high-value deals
        if (!dealGr.getValue('is_won') || !dealGr.getValue('snapshot_taken') || !dealGr.getValue('snapshot_timestamp')) {
            gs.warn('Commission Management: Deal is not properly closed or snapshot incomplete');
            current.setValue('commission_calculated', PAYMENT_CALC_STATE.ERROR);
            return;
        }
        
        // BUSINESS REQUIREMENT: Check if deal requires approval and is approved
        if (dealGr.getValue('requires_finance_approval') === 'true' && 
            dealGr.getValue('finance_approved') !== 'true') {
            gs.warn('Commission Management: Deal requires finance approval before commission calculation');
            current.setValue('commission_calculated', PAYMENT_CALC_STATE.PENDING);
            return;
        }
        
        // SAFEGUARD: Validate commission owner exists and was active at close
        var commissionOwner = dealGr.getValue('owner_at_close');
        if (!commissionOwner) {
            gs.error('Commission Management: No commission owner in snapshot');
            current.setValue('commission_calculated', PAYMENT_CALC_STATE.ERROR);
            return;
        }
        
        var ownerGr = new GlideRecord('sys_user');
        if (!ownerGr.get(commissionOwner)) {
            gs.error('Commission Management: Commission owner not found: ' + commissionOwner);
            current.setValue('commission_calculated', PAYMENT_CALC_STATE.ERROR);
            return;
        }
        
        // BUSINESS REQUIREMENT: Use deal close date for all temporal lookups (not current date)
        var closeDate = dealGr.getValue('close_date');
        if (!closeDate) {
            gs.error('Commission Management: Deal has no close date');
            current.setValue('commission_calculated', PAYMENT_CALC_STATE.ERROR);
            return;
        }
        
        // Get commission plan using baseline close-date selection, then apply recognition policy for runtime temporal basis
        var commissionPlan = getCommissionPlan(commissionOwner, closeDate);
        if (!commissionPlan.planId) {
            // BUSINESS REQUIREMENT: Create exception for missing plans rather than failing
            createMissingPlanException(dealGr, commissionOwner, closeDate);
            gs.warn('Commission Management: No commission plan found - exception created for manual resolution');
            current.setValue('commission_calculated', PAYMENT_CALC_STATE.PENDING);
            return;
        }

        var recognitionPolicy = resolveRecognitionPolicy(commissionPlan.planId, closeDate);
        var recognitionContext = resolveRecognitionContext({
            policy: recognitionPolicy,
            paymentDate: current.getValue('payment_date'),
            invoiceDate: invoiceGr.getValue('invoice_date'),
            closeDate: closeDate,
            snapshotTimestamp: dealGr.getValue('snapshot_timestamp')
        });

        var temporalLookupDate = recognitionContext.temporalLookupDate;
        if (!temporalLookupDate) {
            gs.error('Commission Management: Unable to resolve temporal lookup date from recognition policy context');
            current.setValue('commission_calculated', PAYMENT_CALC_STATE.ERROR);
            return;
        }

        if (temporalLookupDate !== closeDate) {
            var planAtBasisDate = getCommissionPlan(commissionOwner, temporalLookupDate);
            if (planAtBasisDate.planId) {
                commissionPlan = planAtBasisDate;
                recognitionPolicy = resolveRecognitionPolicy(commissionPlan.planId, temporalLookupDate);
                recognitionContext = resolveRecognitionContext({
                    policy: recognitionPolicy,
                    paymentDate: current.getValue('payment_date'),
                    invoiceDate: invoiceGr.getValue('invoice_date'),
                    closeDate: closeDate,
                    snapshotTimestamp: dealGr.getValue('snapshot_timestamp')
                });
                temporalLookupDate = recognitionContext.temporalLookupDate;
            }
        }
        
        var tierEvaluation = evaluateEffectiveCommissionRate({
            plan: commissionPlan,
            salesRep: commissionOwner,
            closeDate: temporalLookupDate,
            dealId: dealGr.getUniqueValue(),
            dealType: dealTypeCode,
            dealTypeRef: dealTypeRef,
            dealAmount: parseFloat(dealGr.getValue('amount')) || 0
        });

        var commissionRate = tierEvaluation.effectiveRate;
        if (!commissionRate || commissionRate <= 0) {
            gs.error('Commission Management: Invalid commission rate for deal type ' + dealTypeCode);
            current.setValue('commission_calculated', PAYMENT_CALC_STATE.ERROR);
            return;
        }
        
        // BUSINESS REQUIREMENT: Enhanced amount validation preserving business flexibility
        var invoiceSubtotal = parseFloat(invoiceGr.getValue('subtotal')) || 0;
        var invoiceTotal = parseFloat(invoiceGr.getValue('total_amount')) || 0;
        var paymentAmount = parseFloat(current.getValue('payment_amount')) || 0;
        
        if (invoiceSubtotal <= 0 || invoiceTotal <= 0) {
            gs.error('Commission Management: Invalid invoice amounts');
            current.setValue('commission_calculated', PAYMENT_CALC_STATE.ERROR);
            return;
        }
        
        // BUSINESS REQUIREMENT: Allow payments exceeding invoice with warning (not blocking)
        var maxPaymentVariance = 1.2; // 20% over invoice allowed
        if (Math.abs(paymentAmount) > invoiceTotal * maxPaymentVariance) {
            gs.warn('Commission Management: Payment amount ' + paymentAmount + ' significantly exceeds invoice total ' + invoiceTotal);
            current.setValue('payment_amount_validation', 'warning');
            current.setValue('validation_notes', 'Payment exceeds invoice by more than 20%');
        }
        
        // BUSINESS REQUIREMENT: Precise calculation maintaining subtotal focus
        var paymentRatio = invoiceTotal > 0 ? Math.min(Math.abs(paymentAmount) / invoiceTotal, 1.0) : 0;
        var commissionBaseAmount = Math.round(invoiceSubtotal * paymentRatio * 100) / 100;
        var effectiveCommissionComponent = calculateMarginalCommissionAmount({
            planId: commissionPlan.planId,
            dealType: tierEvaluation.appliedDealType || dealTypeCode,
            baseRate: tierEvaluation.baseRate || commissionRate,
            attainedBeforePercent: tierEvaluation.attainedBeforePercent,
            attainedAfterPercent: tierEvaluation.attainmentPercent,
            baseAmount: commissionBaseAmount
        });
        var commissionAmount = effectiveCommissionComponent;
        
        // Handle refunds (negative amounts)
        var isNegative = current.getValue('payment_type') === 'refund' || paymentAmount < 0;
        if (isNegative) {
            commissionAmount = -Math.abs(commissionAmount);
            effectiveCommissionComponent = -Math.abs(effectiveCommissionComponent);
        }

        var baseRateForExplainability = tierEvaluation.baseRate || commissionRate;
        var baseCommissionComponent = Math.round(commissionBaseAmount * (baseRateForExplainability / 100) * 100) / 100;
        if (isNegative) {
            baseCommissionComponent = -Math.abs(baseCommissionComponent);
        }

        var acceleratorDeltaComponent = Math.round((effectiveCommissionComponent - baseCommissionComponent) * 100) / 100;

        var baseCommissionAmount = effectiveCommissionComponent;
        var bonusEvaluation = evaluateStructuredBonuses({
            salesRep: commissionOwner,
            commissionPlanId: commissionPlan.planId,
            paymentId: current.getUniqueValue(),
            paymentDate: current.getValue('payment_date'),
            dealId: dealGr.getUniqueValue(),
            dealType: tierEvaluation.appliedDealType || dealTypeCode,
            dealTypeCandidates: tierEvaluation.dealTypeCandidates || resolveDealTypeCandidates(dealGr.getUniqueValue(), dealTypeRef),
            dealAmount: parseFloat(dealGr.getValue('amount')) || 0,
            invoiceId: invoiceGr.getUniqueValue(),
            evaluationDate: temporalLookupDate,
            attainmentPercent: tierEvaluation.attainmentPercent,
            baseCommissionAmount: baseCommissionAmount,
            isNegative: isNegative
        });

        var bonusComponent = Math.round((parseFloat(bonusEvaluation.totalBonusAmount) || 0) * 100) / 100;
        commissionAmount = Math.round((baseCommissionAmount + bonusComponent) * 100) / 100;
        
        // BUSINESS REQUIREMENT: Commission approval for high values without blocking processing
        var approvalThreshold = parseFloat(gs.getProperty('x_823178_commissio.approval_threshold', '10000'));
        var maxCommissionLimit = parseFloat(gs.getProperty('x_823178_commissio.max_commission_per_payment', '50000'));
        
        var requiresApproval = Math.abs(commissionAmount) > approvalThreshold;
        var exceedsLimit = Math.abs(commissionAmount) > maxCommissionLimit;
        
        if (exceedsLimit) {
            // Check for approved exception
            var approvedHighCommission = checkApprovedOverride(current.sys_id, 'high_value_commission');
            if (!approvedHighCommission) {
                gs.error('Commission Management: Commission amount $' + commissionAmount.toFixed(2) + ' exceeds maximum limit $' + maxCommissionLimit.toFixed(2) + ' - requires exception approval');
                current.setValue('commission_calculated', PAYMENT_CALC_STATE.ERROR);
                createHighValueCommissionException(current, commissionAmount, maxCommissionLimit);
                return;
            } else {
                gs.info('Commission Management: High commission approved via exception process');
            }
        }
        
        // BUSINESS REQUIREMENT: Create calculation with comprehensive audit trail
        var payoutSchedule = getPayoutSchedule(recognitionContext.payoutAnchorDate, recognitionContext.recognitionBasis);
        var calculationId = createCommissionCalculation({
            payment: current.sys_id,
            deal: dealGr.sys_id,
            invoice: invoiceGr.sys_id,
            salesRep: commissionOwner,
            commissionPlan: commissionPlan.planId,
            commissionBaseAmount: commissionBaseAmount,
            commissionRate: commissionRate,
            commissionAmount: commissionAmount,
            paymentDate: current.getValue('payment_date'),
            recognitionDateSnapshot: recognitionContext.recognitionDate,
            temporalLookupDateSnapshot: temporalLookupDate,
            recognitionBasisSnapshot: recognitionContext.recognitionBasis,
            recognitionPolicyVersionSnapshot: recognitionPolicy.versionNumber,
            recognitionPolicyRecord: recognitionPolicy.policyId,
            payoutEligibleDate: payoutSchedule.payout_eligible_date,
            payoutScheduleSnapshot: payoutSchedule.snapshot,
            dealCloseDate: closeDate,
            dealType: tierEvaluation.appliedDealType || dealTypeCode,
            dealTypeRef: resolveDealTypeReferenceByCodeRequired(tierEvaluation.appliedDealType || dealTypeCode),
            isNegative: isNegative,
            requiresApproval: requiresApproval,
            bonusAmount: bonusEvaluation.totalBonusAmount,
            bonusEarnedCount: bonusEvaluation.earnedBonuses.length,
            bonusSummarySnapshot: bonusEvaluation.summarySnapshot,
            baseCommissionComponent: baseCommissionComponent,
            acceleratorDeltaComponent: acceleratorDeltaComponent,
            bonusComponent: bonusComponent,
            effectiveTierName: tierEvaluation.tierName,
            effectiveTierFloorPercent: tierEvaluation.tierFloorPercent,
            attainmentPercentAtCalc: tierEvaluation.attainmentPercent,
            quotaAmountSnapshot: tierEvaluation.quotaAmount,
            attainedAmountSnapshot: tierEvaluation.attainedAmount,
            acceleratorApplied: tierEvaluation.acceleratorApplied,
            calculationInputs: {
                invoiceSubtotal: invoiceSubtotal,
                invoiceTotal: invoiceTotal,
                paymentAmount: paymentAmount,
                paymentRatio: paymentRatio,
                planName: commissionPlan.planName,
                originalDealType: dealTypeCode,
                appliedDealType: tierEvaluation.appliedDealType,
                dealTypeCandidates: tierEvaluation.dealTypeCandidates,
                rateEvaluations: tierEvaluation.rateEvaluations,
                rateSelectionModel: 'highest_applicable_classification',
                baseRate: tierEvaluation.baseRate,
                effectiveRate: tierEvaluation.effectiveRate,
                attainedBeforePercent: tierEvaluation.attainedBeforePercent,
                tierName: tierEvaluation.tierName,
                tierFloorPercent: tierEvaluation.tierFloorPercent,
                tierCeilingPercent: tierEvaluation.tierCeilingPercent,
                attainmentPercent: tierEvaluation.attainmentPercent,
                quotaAmount: tierEvaluation.quotaAmount,
                attainedBeforeAmount: tierEvaluation.attainedBeforeAmount,
                attainedAmount: tierEvaluation.attainedAmount,
                acceleratorApplied: tierEvaluation.acceleratorApplied,
                payoutComputationMode: 'marginal_tier_bands',
                recognitionBasis: recognitionContext.recognitionBasis,
                recognitionDate: recognitionContext.recognitionDate,
                temporalLookupDate: temporalLookupDate,
                recognitionPolicyVersion: recognitionPolicy.versionNumber,
                recognitionPolicyId: recognitionPolicy.policyId,
                payoutSchedule: payoutSchedule,
                bonusAmount: bonusEvaluation.totalBonusAmount,
                bonusEarnedCount: bonusEvaluation.earnedBonuses.length,
                bonusSummary: bonusEvaluation.summarySnapshot,
                baseCommissionComponent: baseCommissionComponent,
                acceleratorDeltaComponent: acceleratorDeltaComponent,
                bonusComponent: bonusComponent
            }
        });
        
        if (calculationId) {
            persistBonusEarnings(calculationId, current.getUniqueValue(), bonusEvaluation.earnedBonuses);
            current.setValue('commission_calculated', PAYMENT_CALC_STATE.CALCULATED);
            current.setValue('commission_calculation_id', calculationId);
            current.setValue('calculation_lock', false);
            gs.info('Commission Management: Commission calculated - Amount: $' + commissionAmount.toFixed(2) + 
                   (requiresApproval ? ' (Requires Approval)' : ''));
        } else {
            current.setValue('commission_calculated', PAYMENT_CALC_STATE.ERROR);
            gs.error('Commission Management: Failed to create commission calculation');
        }
        
    } catch (e) {
        gs.error('Commission Management: Error calculating commission - ' + e.message);
        current.setValue('commission_calculated', PAYMENT_CALC_STATE.ERROR);
        current.setValue('calculation_lock', false);
    }
}

function shouldRecalculate(paymentRecord) {
    // Allow recalculation if specifically requested or if calculation is in error state
    if (paymentRecord.getValue('commission_calculated') === PAYMENT_CALC_STATE.ERROR) {
            commissionGr.setValue('status', CALC_STATUS.DRAFT);
        return true;
    }
    
    // Check for approved recalculation request
    var approvedRecalc = checkApprovedOverride(paymentRecord.sys_id, 'recalculation_request');
    return approvedRecalc !== false;
}

function createMissingPlanException(dealRecord, salesRep, closeDate) {
    try {
        var exceptionGr = new GlideRecord('x_823178_commissio_system_alerts');
        exceptionGr.initialize();
        exceptionGr.setValue('title', 'Missing Commission Plan');
        exceptionGr.setValue('message', 'No commission plan found for rep ' + salesRep + ' at close date ' + closeDate + ' for deal ' + dealRecord.getValue('deal_name'));
        exceptionGr.setValue('severity', 'high');
        exceptionGr.setValue('alert_date', new GlideDateTime().getDisplayValue());
        exceptionGr.setValue('status', 'open');
        exceptionGr.insert();
    } catch (e) {
        gs.error('Commission Management: Failed to create missing plan exception - ' + e.message);
    }
}

function createHighValueCommissionException(paymentRecord, commissionAmount, limit) {
    try {
        var exceptionGr = new GlideRecord('x_823178_commissio_exception_approvals');
        exceptionGr.initialize();
        exceptionGr.setValue('request_type', 'high_value_commission');
        exceptionGr.setValue('reference_record', paymentRecord.sys_id);
        exceptionGr.setValue('reference_table', 'x_823178_commissio_payments');
        exceptionGr.setValue('requested_by', gs.getUserID());
        exceptionGr.setValue('request_date', new GlideDateTime().getDisplayValue());
        exceptionGr.setValue('business_justification', 'Auto-generated: Commission amount $' + commissionAmount.toFixed(2) + ' exceeds limit $' + limit.toFixed(2));
        exceptionGr.setValue('requested_amount', Math.abs(commissionAmount));
        exceptionGr.setValue('current_amount', limit);
        exceptionGr.setValue('variance_amount', Math.abs(commissionAmount) - limit);
        exceptionGr.setValue('status', 'pending');
        exceptionGr.insert();
    } catch (e) {
        gs.error('Commission Management: Failed to create high value exception - ' + e.message);
    }
}

function getCommissionPlan(salesRep, closeDate) {
    var gr = new GlideRecord('x_823178_commissio_commission_plans');
    gr.addQuery('sales_rep', salesRep);
    gr.addQuery('effective_start_date', '<=', closeDate);
    gr.addQuery('is_active', true);
    gr.addNullQuery('effective_end_date').addOrCondition('effective_end_date', '>=', closeDate);
    gr.orderByDesc('effective_start_date');
    gr.query();
    
    var plans = [];
    while (gr.next()) {
        plans.push({
            planId: gr.sys_id.toString(),
            planName: gr.getValue('plan_name'),
            startDate: gr.getValue('effective_start_date'),
            endDate: gr.getValue('effective_end_date')
        });
    }
    
    if (plans.length === 0) {
        return { planId: null, error: 'No active plan found' };
    }
    
    if (plans.length > 1) {
        gs.warn('Commission Management: Multiple overlapping plans found for rep at ' + closeDate + '. Using most recent: ' + plans[0].planName);
    }
    
    return plans[0];
}

function resolveRecognitionPolicy(planId, policyDate) {
    var basisFallback = (gs.getProperty('x_823178_commissio.default_recognition_basis', 'cash_received') || 'cash_received').toString();
    var selected = {
        recognitionBasis: basisFallback,
        versionNumber: '0',
        policyId: ''
    };

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
        selected.recognitionBasis = (policyGr.getValue('recognition_basis') || basisFallback || 'cash_received').toString();
        selected.versionNumber = (policyGr.getValue('version_number') || '1').toString();
        selected.policyId = policyGr.getUniqueValue();
    }

    return selected;
}

function resolveRecognitionContext(params) {
    var basis = (params.policy && params.policy.recognitionBasis ? params.policy.recognitionBasis : 'cash_received').toString();
    var paymentDate = (params.paymentDate || '').toString();
    var invoiceDate = (params.invoiceDate || '').toString();
    var closeDate = (params.closeDate || '').toString();
    var snapshotDate = extractDateOnly(params.snapshotTimestamp);

    var recognitionDate = paymentDate;
    var temporalLookupDate = closeDate;

    if (basis === 'invoice_issued') {
        recognitionDate = invoiceDate || paymentDate || closeDate;
        temporalLookupDate = recognitionDate || closeDate;
    } else if (basis === 'booking') {
        recognitionDate = closeDate || paymentDate;
        temporalLookupDate = recognitionDate || closeDate;
    } else if (basis === 'milestone') {
        recognitionDate = snapshotDate || closeDate || paymentDate;
        temporalLookupDate = recognitionDate || closeDate;
    } else {
        basis = 'cash_received';
        recognitionDate = paymentDate || closeDate;
        temporalLookupDate = closeDate || recognitionDate;
    }

    return {
        recognitionBasis: basis,
        recognitionDate: recognitionDate,
        temporalLookupDate: temporalLookupDate,
        payoutAnchorDate: basis === 'cash_received' ? (paymentDate || recognitionDate) : recognitionDate
    };
}

function extractDateOnly(value) {
    if (!value) {
        return '';
    }
    var str = value.toString();
    if (str.length >= 10) {
        return str.substring(0, 10);
    }
    return str;
}

function evaluateEffectiveCommissionRate(params) {
    var plan = params.plan;
    var salesRep = params.salesRep;
    var closeDate = params.closeDate;
    var dealId = params.dealId;
    var dealType = params.dealType;
    var dealTypeRef = params.dealTypeRef;
    var dealAmount = Math.abs(parseFloat(params.dealAmount) || 0);

    var dealTypeCandidates = resolveDealTypeCandidates(dealId, dealTypeRef);
    if (dealTypeCandidates.length === 0) {
        return {
            baseRate: 0,
            effectiveRate: 0,
            tierName: '',
            tierFloorPercent: 0,
            tierCeilingPercent: 0,
            attainmentPercent: 0,
            attainedBeforePercent: 0,
            quotaAmount: 0,
            attainedBeforeAmount: 0,
            attainedAmount: 0,
            acceleratorApplied: false,
            appliedDealType: '',
            dealTypeCandidates: [],
            rateEvaluations: []
        };
    }

    var quotaAmount = getPlanQuotaAmount(plan.planId, plan);
    var attainedBefore = getRepAttainedAmountBeforeDeal(salesRep, closeDate, dealId);
    var attainedAmount = attainedBefore + dealAmount;
    var attainedBeforePercent = quotaAmount > 0 ? (attainedBefore / quotaAmount) * 100 : 0;
    var attainmentPercent = quotaAmount > 0 ? (attainedAmount / quotaAmount) * 100 : 0;

    var evaluations = [];
    for (var i = 0; i < dealTypeCandidates.length; i++) {
        var candidateDealType = dealTypeCandidates[i];
        var candidateBaseRate = getCommissionRateForDealType(plan, candidateDealType);
        var candidateTier = resolveTierForAttainment(plan.planId, attainmentPercent, candidateDealType);
        var candidateMarginalRate = calculateMarginalEffectiveRate({
            planId: plan.planId,
            dealType: candidateDealType,
            baseRate: candidateBaseRate,
            attainedBeforePercent: attainedBeforePercent,
            attainedAfterPercent: attainmentPercent,
            amount: dealAmount
        });
        var candidateEffectiveRate = candidateMarginalRate > 0 ? candidateMarginalRate : (candidateTier ? candidateTier.ratePercent : candidateBaseRate);

        if (!candidateEffectiveRate || candidateEffectiveRate <= 0) {
            candidateEffectiveRate = candidateBaseRate;
        }

        evaluations.push({
            dealType: candidateDealType,
            baseRate: candidateBaseRate,
            effectiveRate: candidateEffectiveRate,
            tier: candidateTier,
            candidateOrder: i
        });
    }

    var selectedEvaluation = selectHighestRateEvaluation(evaluations);
    var selectedTier = selectedEvaluation ? selectedEvaluation.tier : null;
    var selectedBaseRate = selectedEvaluation ? selectedEvaluation.baseRate : getCommissionRateForDealType(plan, dealTypeCandidates[0]);
    var selectedEffectiveRate = selectedEvaluation ? selectedEvaluation.effectiveRate : selectedBaseRate;
    var selectedDealType = selectedEvaluation ? selectedEvaluation.dealType : dealTypeCandidates[0];

    return {
        baseRate: selectedBaseRate,
        effectiveRate: selectedEffectiveRate,
        tierName: selectedTier ? selectedTier.tierName : '',
        tierFloorPercent: selectedTier ? selectedTier.floorPercent : 0,
        tierCeilingPercent: selectedTier ? selectedTier.ceilingPercent : 0,
        attainmentPercent: attainmentPercent,
        attainedBeforePercent: attainedBeforePercent,
        quotaAmount: quotaAmount,
        attainedBeforeAmount: attainedBefore,
        attainedAmount: attainedAmount,
        acceleratorApplied: !!(selectedTier && selectedTier.floorPercent >= 100),
        appliedDealType: selectedDealType,
        dealTypeCandidates: dealTypeCandidates,
        rateEvaluations: evaluations
    };
}

function selectHighestRateEvaluation(evaluations) {
    if (!evaluations || evaluations.length === 0) {
        return null;
    }

    var best = null;
    for (var i = 0; i < evaluations.length; i++) {
        var candidate = evaluations[i];
        if (!best) {
            best = candidate;
            continue;
        }

        var candidateRate = parseFloat(candidate.effectiveRate) || 0;
        var bestRate = parseFloat(best.effectiveRate) || 0;
        if (candidateRate > bestRate) {
            best = candidate;
            continue;
        }

        if (candidateRate === bestRate) {
            var candidateFloor = candidate.tier ? (parseFloat(candidate.tier.floorPercent) || 0) : 0;
            var bestFloor = best.tier ? (parseFloat(best.tier.floorPercent) || 0) : 0;
            if (candidateFloor > bestFloor) {
                best = candidate;
                continue;
            }

            if (candidateFloor === bestFloor && (candidate.candidateOrder || 0) < (best.candidateOrder || 0)) {
                best = candidate;
            }
        }
    }

    return best;
}

function getCommissionRateForDealType(plan, dealType) {
    var targetRate = getPlanTargetCommissionRate(plan.planId, dealType);
    if (targetRate > 0) {
        return targetRate;
    }
    return 0;
}

function getPlanTargetCommissionRate(planId, dealType) {
    var normalizedDealType = normalizeDealTypeKey(dealType);
    var targetGr = new GlideRecord('x_823178_commissio_plan_targets');
    targetGr.addQuery('commission_plan', planId);
    targetGr.addQuery('is_active', true);
    targetGr.query();

    while (targetGr.next()) {
        var targetDealType = resolveDealTypeCodeFromReference(targetGr.getValue('deal_type_ref'));
        if (!targetDealType || targetDealType !== normalizedDealType) {
            continue;
        }

        var rate = parseFloat(targetGr.getValue('commission_rate_percent')) || 0;
        if (rate > 0) {
            return rate;
        }
    }

    return 0;
}

function getTierBandsForDealType(planId, dealType) {
    var bands = [];
    var normalizedDealType = normalizeDealTypeKey(dealType) || 'other';
    var planTargetId = getPlanTargetIdForDealType(planId, normalizedDealType);

    var tierGr = new GlideRecord('x_823178_commissio_plan_tiers');
    tierGr.addQuery('commission_plan', planId);
    tierGr.addQuery('is_active', true);
    tierGr.orderBy('attainment_floor_percent');
    tierGr.query();

    while (tierGr.next()) {
        var tierTargetId = (tierGr.getValue('plan_target') || '').toString();
        if (planTargetId && tierTargetId && tierTargetId !== planTargetId) {
            continue;
        }

        var tierDealType = resolveTierDealTypeCode(tierGr);
        if (!tierDealType || tierDealType !== normalizedDealType) {
            continue;
        }

        var floor = parseFloat(tierGr.getValue('attainment_floor_percent')) || 0;
        var ceiling = parseFloat(tierGr.getValue('attainment_ceiling_percent'));
        var rate = parseFloat(tierGr.getValue('commission_rate_percent')) || 0;
        if (isNaN(ceiling)) {
            continue;
        }

        bands.push({
            tierName: tierGr.getValue('tier_name') || 'Tier',
            floorPercent: floor,
            ceilingPercent: ceiling,
            ratePercent: rate
        });
    }

    return bands;
}

function calculateMarginalEffectiveRate(params) {
    var amount = Math.abs(parseFloat(params.amount) || 0);
    if (amount <= 0) {
        return 0;
    }

    var baseRate = parseFloat(params.baseRate) || 0;
    var beforePercent = parseFloat(params.attainedBeforePercent) || 0;
    var afterPercent = parseFloat(params.attainedAfterPercent) || 0;
    var totalPercentDelta = afterPercent - beforePercent;
    if (totalPercentDelta <= 0) {
        return baseRate;
    }

    var bands = getTierBandsForDealType(params.planId, params.dealType);
    if (!bands.length) {
        return baseRate;
    }

    var weightedRate = 0;
    var coveredPercent = 0;

    for (var i = 0; i < bands.length; i++) {
        var band = bands[i];
        var overlapStart = Math.max(beforePercent, band.floorPercent);
        var overlapEnd = Math.min(afterPercent, band.ceilingPercent);
        var overlap = overlapEnd - overlapStart;
        if (overlap <= 0) {
            continue;
        }

        coveredPercent += overlap;
        weightedRate += (overlap / totalPercentDelta) * (parseFloat(band.ratePercent) || 0);
    }

    if (coveredPercent < totalPercentDelta) {
        weightedRate += ((totalPercentDelta - coveredPercent) / totalPercentDelta) * baseRate;
    }

    return Math.round(weightedRate * 10000) / 10000;
}

function calculateMarginalCommissionAmount(params) {
    var baseAmount = Math.abs(parseFloat(params.baseAmount) || 0);
    if (baseAmount <= 0) {
        return 0;
    }

    var baseRate = parseFloat(params.baseRate) || 0;
    var beforePercent = parseFloat(params.attainedBeforePercent) || 0;
    var afterPercent = parseFloat(params.attainedAfterPercent) || 0;
    var totalPercentDelta = afterPercent - beforePercent;
    if (totalPercentDelta <= 0) {
        return Math.round(baseAmount * (baseRate / 100) * 100) / 100;
    }

    var bands = getTierBandsForDealType(params.planId, params.dealType);
    if (!bands.length) {
        return Math.round(baseAmount * (baseRate / 100) * 100) / 100;
    }

    var commission = 0;
    var coveredPercent = 0;

    for (var i = 0; i < bands.length; i++) {
        var band = bands[i];
        var overlapStart = Math.max(beforePercent, band.floorPercent);
        var overlapEnd = Math.min(afterPercent, band.ceilingPercent);
        var overlap = overlapEnd - overlapStart;
        if (overlap <= 0) {
            continue;
        }

        coveredPercent += overlap;
        var bandBaseAmount = baseAmount * (overlap / totalPercentDelta);
        commission += bandBaseAmount * ((parseFloat(band.ratePercent) || 0) / 100);
    }

    if (coveredPercent < totalPercentDelta) {
        var uncoveredBaseAmount = baseAmount * ((totalPercentDelta - coveredPercent) / totalPercentDelta);
        commission += uncoveredBaseAmount * (baseRate / 100);
    }

    return Math.round(commission * 100) / 100;
}

function getPlanQuotaAmount(planId, plan) {
    var totalQuota = 0;
    var targetGr = new GlideRecord('x_823178_commissio_plan_targets');
    targetGr.addQuery('commission_plan', planId);
    targetGr.addQuery('is_active', true);
    targetGr.query();
    while (targetGr.next()) {
        totalQuota += parseFloat(targetGr.getValue('annual_target_amount')) || 0;
    }

    return totalQuota;
}

function getRepAttainedAmountBeforeDeal(salesRep, closeDate, currentDealId) {
    var attained = 0;
    var dealGr = new GlideRecord('x_823178_commissio_deals');
    dealGr.addQuery('owner_at_close', salesRep);
    dealGr.addQuery('is_won', true);
    dealGr.addQuery('close_date', '<=', closeDate);
    if (currentDealId) {
        dealGr.addQuery('sys_id', '!=', currentDealId);
    }
    dealGr.query();

    while (dealGr.next()) {
        attained += Math.abs(parseFloat(dealGr.getValue('amount')) || 0);
    }
    return attained;
}

function resolveTierForAttainment(planId, attainmentPercent, dealType) {
    var tierGr = new GlideRecord('x_823178_commissio_plan_tiers');
    tierGr.addQuery('commission_plan', planId);
    tierGr.addQuery('is_active', true);
    tierGr.orderBy('attainment_floor_percent');
    tierGr.query();

    var selectedTier = null;
    var highestEligibleTier = null;
    var normalizedDealType = normalizeDealTypeKey(dealType);
    var planTargetId = getPlanTargetIdForDealType(planId, normalizedDealType);

    while (tierGr.next()) {
        var tierTargetId = (tierGr.getValue('plan_target') || '').toString();
        if (planTargetId && tierTargetId && tierTargetId !== planTargetId) {
            continue;
        }

        var tierDealType = resolveTierDealTypeCode(tierGr);
        var dealTypeMatches = !!tierDealType && tierDealType === normalizedDealType;
        if (!dealTypeMatches) {
            continue;
        }

        var floor = parseFloat(tierGr.getValue('attainment_floor_percent')) || 0;
        var ceilingRaw = parseFloat(tierGr.getValue('attainment_ceiling_percent'));
        var hasCeiling = !isNaN(ceilingRaw) && ceilingRaw > 0;
        var ceiling = hasCeiling ? ceilingRaw : 0;

        if (attainmentPercent >= floor) {
            highestEligibleTier = {
                tierName: tierGr.getValue('tier_name') || 'Tier',
                floorPercent: floor,
                ceilingPercent: ceiling,
                hasCeiling: hasCeiling,
                ratePercent: parseFloat(tierGr.getValue('commission_rate_percent')) || 0
            };
        }

        if (attainmentPercent >= floor && (!hasCeiling || attainmentPercent <= ceiling)) {
            selectedTier = {
                tierName: tierGr.getValue('tier_name') || 'Tier',
                floorPercent: floor,
                ceilingPercent: ceiling,
                hasCeiling: hasCeiling,
                ratePercent: parseFloat(tierGr.getValue('commission_rate_percent')) || 0
            };
        }
    }

    if (selectedTier) {
        return selectedTier;
    }

    if (highestEligibleTier && highestEligibleTier.hasCeiling && attainmentPercent > highestEligibleTier.ceilingPercent) {
        return highestEligibleTier;
    }

    return null;
}

function getPlanTargetIdForDealType(planId, dealType) {
    var normalized = normalizeDealTypeKey(dealType);
    if (!planId || !normalized) {
        return '';
    }

    var targetGr = new GlideRecord('x_823178_commissio_plan_targets');
    targetGr.addQuery('commission_plan', planId);
    targetGr.addQuery('is_active', true);
    targetGr.query();

    while (targetGr.next()) {
        var targetDealType = resolveDealTypeCodeFromReference(targetGr.getValue('deal_type_ref'));
        if (targetDealType === normalized) {
            return targetGr.getUniqueValue();
        }
    }

    return '';
}

function normalizeDealTypeKey(value) {
    return normalizeDealTypeCanonical(value, '');
}

function resolveDealTypeCandidates(dealId, dealTypeRef) {
    var seen = {};
    var candidates = [];

    if (dealId) {
        var classGr = new GlideRecord('x_823178_commissio_deal_classifications');
        classGr.addQuery('deal', dealId);
        classGr.addQuery('is_active', true);
        classGr.orderByDesc('is_primary');
        classGr.orderBy('priority');
        classGr.orderBy('sys_created_on');
        classGr.query();

        while (classGr.next()) {
            var mapped = resolveDealTypeCodeFromReference(classGr.getValue('deal_type_ref'));
            if (!mapped || seen[mapped]) {
                continue;
            }
            seen[mapped] = true;
            candidates.push(mapped);
        }
    }

    var primaryFromRef = resolveDealTypeCodeFromReference(dealTypeRef);
    if (primaryFromRef && !seen[primaryFromRef]) {
        seen[primaryFromRef] = true;
        candidates.push(primaryFromRef);
    }

    return candidates;
}

function evaluateStructuredBonuses(params) {
    var result = {
        totalBonusAmount: 0,
        earnedBonuses: [],
        summarySnapshot: ''
    };

    if (params.isNegative) {
        result.summarySnapshot = 'No bonus evaluation for refund/negative payment';
        return result;
    }

    var bonusGr = new GlideRecord('x_823178_commissio_plan_bonuses');
    bonusGr.addQuery('commission_plan', params.commissionPlanId);
    bonusGr.addQuery('is_active', true);
    bonusGr.addQuery('is_discretionary', false);
    bonusGr.orderBy('bonus_name');
    bonusGr.query();

    var summaryRows = [];

    while (bonusGr.next()) {
        var bonusId = bonusGr.getUniqueValue();
        var bonusName = bonusGr.getValue('bonus_name') || 'Bonus';
        var bonusAmount = parseFloat(bonusGr.getValue('bonus_amount')) || 0;
        var metric = (bonusGr.getValue('qualification_metric') || '').toString();
        var operator = (bonusGr.getValue('qualification_operator') || 'gte').toString();
        var threshold = parseFloat(bonusGr.getValue('qualification_threshold'));
        var period = (bonusGr.getValue('evaluation_period') || 'calculation').toString();
        var oneTimePerPeriod = bonusGr.getValue('one_time_per_period') === 'true' || bonusGr.getValue('one_time_per_period') === true;
        var bonusDealType = normalizeBonusDealType(resolveDealTypeCodeFromReference(bonusGr.getValue('deal_type_ref')));

        if (!metric || isNaN(threshold)) {
            summaryRows.push(bonusName + ': skipped (incomplete structured condition)');
            continue;
        }

        if (!bonusScopeMatches(bonusDealType, params.dealType, params.dealTypeCandidates)) {
            summaryRows.push(bonusName + ': not qualified (deal type scope mismatch)');
            continue;
        }

        var periodInfo = resolveBonusPeriod(params.evaluationDate || params.paymentDate, period, params.paymentId);
        var metricValue = resolveBonusMetricValue(metric, params, periodInfo, bonusDealType);
        var qualified = compareThreshold(metricValue, threshold, operator);

        if (!qualified) {
            summaryRows.push(bonusName + ': not qualified (' + metricValue + ' ' + operator + ' ' + threshold + ')');
            continue;
        }

        if (oneTimePerPeriod && hasExistingOneTimeBonusEarning({
            bonusId: bonusId,
            salesRep: params.salesRep,
            periodKey: periodInfo.periodKey,
            paymentId: params.paymentId
        })) {
            summaryRows.push(bonusName + ': already earned for period ' + periodInfo.periodKey);
            continue;
        }

        var normalizedBonusAmount = Math.round(Math.abs(bonusAmount) * 100) / 100;
        if (normalizedBonusAmount <= 0) {
            summaryRows.push(bonusName + ': skipped (bonus amount <= 0)');
            continue;
        }

        result.totalBonusAmount += normalizedBonusAmount;
        result.earnedBonuses.push({
            planBonusId: bonusId,
            salesRep: params.salesRep,
            commissionPlanId: params.commissionPlanId,
            paymentId: params.paymentId,
            dealId: params.dealId,
            invoiceId: params.invoiceId,
            earnedAmount: normalizedBonusAmount,
            earnedDate: (params.paymentDate || params.evaluationDate || '').toString(),
            periodKey: periodInfo.periodKey,
            evaluationPeriod: period,
            oneTimePerPeriod: oneTimePerPeriod,
            metricValueSnapshot: metricValue,
            thresholdSnapshot: threshold,
            operatorSnapshot: operator,
            qualificationMetricSnapshot: metric,
            evaluationSnapshot: JSON.stringify({
                bonus_name: bonusName,
                metric: metric,
                operator: operator,
                threshold: threshold,
                metric_value: metricValue,
                period_key: periodInfo.periodKey,
                period_start: periodInfo.periodStart,
                period_end: periodInfo.periodEnd,
                deal_type_scope: bonusDealType,
                one_time_per_period: oneTimePerPeriod
            })
        });

        summaryRows.push(bonusName + ': earned $' + normalizedBonusAmount.toFixed(2));
    }

    result.totalBonusAmount = Math.round(result.totalBonusAmount * 100) / 100;
    result.summarySnapshot = summaryRows.join('; ');
    return result;
}

function normalizeBonusDealType(value) {
    var normalized = normalizeDealTypeKey(value);
    return normalized ? normalized : 'any';
}

function bonusScopeMatches(scope, dealType, dealTypeCandidates) {
    if (scope === 'any') {
        return true;
    }

    var normalizedDealType = normalizeDealTypeKey(dealType) || 'other';
    if (scope === normalizedDealType) {
        return true;
    }

    if (dealTypeCandidates && dealTypeCandidates.length) {
        for (var i = 0; i < dealTypeCandidates.length; i++) {
            if (normalizeDealTypeKey(dealTypeCandidates[i]) === scope) {
                return true;
            }
        }
    }

    return false;
}

function resolveBonusMetricValue(metric, params, periodInfo, bonusScopeDealType) {
    if (metric === 'quota_attainment_percent') {
        return parseFloat(params.attainmentPercent) || 0;
    }

    if (metric === 'deal_amount') {
        return Math.abs(parseFloat(params.dealAmount) || 0);
    }

    if (metric === 'deal_count') {
        return getRepWonDealCountForPeriod(params.salesRep, periodInfo.periodStart, periodInfo.periodEnd, bonusScopeDealType);
    }

    if (metric === 'base_commission_amount') {
        return Math.abs(parseFloat(params.baseCommissionAmount) || 0);
    }

    return 0;
}

function compareThreshold(metricValue, threshold, operator) {
    var left = parseFloat(metricValue) || 0;
    var right = parseFloat(threshold) || 0;

    if (operator === 'gt') {
        return left > right;
    }

    if (operator === 'eq') {
        return Math.abs(left - right) < 0.0001;
    }

    return left >= right;
}

function resolveBonusPeriod(referenceDate, period, paymentId) {
    var dateValue = (referenceDate || '').toString();
    var year = dateValue.length >= 4 ? dateValue.substring(0, 4) : '';
    var month = dateValue.length >= 7 ? dateValue.substring(5, 7) : '01';

    if (period === 'monthly') {
        return {
            periodKey: year + '-' + month,
            periodStart: year + '-' + month + '-01',
            periodEnd: year + '-' + month + '-31'
        };
    }

    if (period === 'quarterly') {
        var monthInt = parseInt(month, 10);
        if (isNaN(monthInt) || monthInt < 1) monthInt = 1;
        var quarter = Math.floor((monthInt - 1) / 3) + 1;
        var quarterStartMonth = ((quarter - 1) * 3) + 1;
        var quarterEndMonth = quarterStartMonth + 2;
        var startMonthStr = (quarterStartMonth < 10 ? '0' : '') + quarterStartMonth;
        var endMonthStr = (quarterEndMonth < 10 ? '0' : '') + quarterEndMonth;

        return {
            periodKey: year + '-Q' + quarter,
            periodStart: year + '-' + startMonthStr + '-01',
            periodEnd: year + '-' + endMonthStr + '-31'
        };
    }

    if (period === 'annual') {
        return {
            periodKey: year,
            periodStart: year + '-01-01',
            periodEnd: year + '-12-31'
        };
    }

    return {
        periodKey: 'calc-' + (paymentId || 'na'),
        periodStart: dateValue,
        periodEnd: dateValue
    };
}

function getRepWonDealCountForPeriod(salesRep, periodStart, periodEnd, dealTypeScope) {
    var count = 0;
    var normalizedScope = normalizeBonusDealType(dealTypeScope);
    var dealGr = new GlideRecord('x_823178_commissio_deals');
    dealGr.addQuery('owner_at_close', salesRep);
    dealGr.addQuery('is_won', true);

    if (periodStart) {
        dealGr.addQuery('close_date', '>=', periodStart);
    }
    if (periodEnd) {
        dealGr.addQuery('close_date', '<=', periodEnd);
    }

    dealGr.query();
    while (dealGr.next()) {
        if (normalizedScope !== 'any') {
            var primaryDealType = resolveDealTypeCodeFromReference(dealGr.getValue('deal_type_ref'));
            if (!primaryDealType) {
                continue;
            }
            var dealTypeCandidates = resolveDealTypeCandidates(dealGr.getUniqueValue(), dealGr.getValue('deal_type_ref'));
            if (!bonusScopeMatches(normalizedScope, primaryDealType, dealTypeCandidates)) {
                continue;
            }
        }
        count += 1;
    }
    return count;
}

function hasExistingOneTimeBonusEarning(params) {
    var earningGr = new GlideRecord('x_823178_commissio_bonus_earnings');
    earningGr.addQuery('plan_bonus', params.bonusId);
    earningGr.addQuery('sales_rep', params.salesRep);
    earningGr.addQuery('period_key', params.periodKey);
    earningGr.addQuery('status', 'earned');
    earningGr.query();

    while (earningGr.next()) {
        if (earningGr.getValue('payment') !== params.paymentId) {
            return true;
        }
    }

    return false;
}

function persistBonusEarnings(calculationId, paymentId, earnedBonuses) {
    clearBonusEarningsForPayment(paymentId);

    if (!earnedBonuses || earnedBonuses.length === 0) {
        return;
    }

    for (var i = 0; i < earnedBonuses.length; i++) {
        var earned = earnedBonuses[i];
        var earningGr = new GlideRecord('x_823178_commissio_bonus_earnings');
        earningGr.initialize();
        earningGr.setValue('commission_calculation', calculationId);
        earningGr.setValue('payment', paymentId);
        earningGr.setValue('deal', earned.dealId);
        earningGr.setValue('invoice', earned.invoiceId);
        earningGr.setValue('sales_rep', earned.salesRep);
        earningGr.setValue('commission_plan', earned.commissionPlanId);
        earningGr.setValue('plan_bonus', earned.planBonusId);
        earningGr.setValue('earned_amount', earned.earnedAmount);
        earningGr.setValue('earned_date', earned.earnedDate);
        earningGr.setValue('period_key', earned.periodKey);
        earningGr.setValue('evaluation_period', earned.evaluationPeriod);
        earningGr.setValue('one_time_per_period', earned.oneTimePerPeriod);
        earningGr.setValue('metric_value_snapshot', earned.metricValueSnapshot);
        earningGr.setValue('threshold_snapshot', earned.thresholdSnapshot);
        earningGr.setValue('operator_snapshot', earned.operatorSnapshot);
        earningGr.setValue('qualification_metric_snapshot', earned.qualificationMetricSnapshot);
        earningGr.setValue('evaluation_snapshot', earned.evaluationSnapshot);
        earningGr.setValue('status', 'earned');
        earningGr.insert();
    }
}

function clearBonusEarningsForPayment(paymentId) {
    if (!paymentId) {
        return;
    }

    var existingGr = new GlideRecord('x_823178_commissio_bonus_earnings');
    existingGr.addQuery('payment', paymentId);
    existingGr.query();

    while (existingGr.next()) {
        existingGr.deleteRecord();
    }
}

function createCommissionCalculation(data) {
    var commissionGr = new GlideRecord('x_823178_commissio_commission_calculations');
    
    // Check for existing calculation
    commissionGr.addQuery('payment', data.payment);
    commissionGr.query();
    if (commissionGr.next()) {
        // Update existing rather than creating duplicate
        gs.info('Commission Management: Updating existing calculation for payment ' + data.payment);
    } else {
        commissionGr.initialize();
    }
    
    commissionGr.setValue('payment', data.payment);
    commissionGr.setValue('deal', data.deal);
    commissionGr.setValue('invoice', data.invoice);
    commissionGr.setValue('sales_rep', data.salesRep);
    commissionGr.setValue('commission_plan', data.commissionPlan);
    commissionGr.setValue('commission_base_amount', data.commissionBaseAmount);
    commissionGr.setValue('commission_rate', data.commissionRate);
    commissionGr.setValue('effective_tier_name', data.effectiveTierName || '');
    commissionGr.setValue('effective_tier_floor_percent', data.effectiveTierFloorPercent || 0);
    commissionGr.setValue('attainment_percent_at_calc', data.attainmentPercentAtCalc || 0);
    commissionGr.setValue('quota_amount_snapshot', data.quotaAmountSnapshot || 0);
    commissionGr.setValue('attained_amount_snapshot', data.attainedAmountSnapshot || 0);
    commissionGr.setValue('accelerator_applied', data.acceleratorApplied || false);
    commissionGr.setValue('bonus_amount', data.bonusAmount || 0);
    commissionGr.setValue('bonus_earned_count', data.bonusEarnedCount || 0);
    commissionGr.setValue('base_commission_component', data.baseCommissionComponent || 0);
    commissionGr.setValue('accelerator_delta_component', data.acceleratorDeltaComponent || 0);
    commissionGr.setValue('bonus_component', data.bonusComponent || 0);
    commissionGr.setValue('commission_amount', data.commissionAmount);
    commissionGr.setValue('payment_date', data.paymentDate);
    if (data.recognitionDateSnapshot) {
        commissionGr.setValue('recognition_date_snapshot', data.recognitionDateSnapshot);
    }
    if (data.temporalLookupDateSnapshot) {
        commissionGr.setValue('temporal_lookup_date_snapshot', data.temporalLookupDateSnapshot);
    }
    if (data.recognitionBasisSnapshot) {
        commissionGr.setValue('recognition_basis_snapshot', data.recognitionBasisSnapshot);
    }
    if (data.recognitionPolicyVersionSnapshot) {
        commissionGr.setValue('recognition_policy_version_snapshot', data.recognitionPolicyVersionSnapshot);
    }
    if (data.recognitionPolicyRecord) {
        commissionGr.setValue('recognition_policy_record', data.recognitionPolicyRecord);
    }
    if (data.payoutEligibleDate) {
        commissionGr.setValue('payout_eligible_date', data.payoutEligibleDate);
    }
    if (data.payoutScheduleSnapshot) {
        commissionGr.setValue('payout_schedule_snapshot', data.payoutScheduleSnapshot);
    }
    if (data.bonusSummarySnapshot) {
        commissionGr.setValue('bonus_summary_snapshot', data.bonusSummarySnapshot);
    }
    commissionGr.setValue('calculation_date', new GlideDateTime().getDisplayValue());
    commissionGr.setValue('deal_close_date', data.dealCloseDate);
    if (data.dealTypeRef) {
        commissionGr.setValue('deal_type_ref', data.dealTypeRef);
    }
    commissionGr.setValue('is_negative', data.isNegative);
    commissionGr.setValue('status', 'draft');
    commissionGr.setValue('calculation_inputs', JSON.stringify(data.calculationInputs));
    commissionGr.setValue('requires_approval', data.requiresApproval || false);
    
    if (!commissionGr.sys_id) {
        commissionGr.setValue('original_calculation_date', new GlideDateTime().getDisplayValue());
        return commissionGr.insert();
    } else {
        var recalcCount = parseInt(commissionGr.getValue('recalculated_count') || '0') + 1;
        commissionGr.setValue('recalculated_count', recalcCount);
        commissionGr.setValue('last_recalculated', new GlideDateTime().getDisplayValue());
        commissionGr.update();
        return commissionGr.sys_id;
    }
}

function resolveTierDealTypeCode(tierGr) {
    if (!tierGr) {
        return '';
    }

    var targetId = (tierGr.getValue('plan_target') || '').toString();
    if (!targetId) {
        return '';
    }

    var targetGr = new GlideRecord('x_823178_commissio_plan_targets');
    if (!targetGr.get(targetId)) {
        return '';
    }

    return resolveDealTypeCodeFromReference(targetGr.getValue('deal_type_ref'));
}

function resolveDealTypeCodeFromReference(refId) {
    if (!refId) {
        return '';
    }

    var typeGr = new GlideRecord('x_823178_commissio_deal_types');
    if (!typeGr.get(refId)) {
        return '';
    }

    if (!isActiveFlag(typeGr.getValue('is_active'))) {
        return '';
    }

    return normalizeDealTypeKey(typeGr.getValue('code'));
}

function resolveDealTypeReferenceByCodeRequired(code) {
    var normalized = normalizeDealTypeKey(code);
    if (!normalized || normalized === 'all' || normalized === 'any') {
        return '';
    }

    var typeGr = new GlideRecord('x_823178_commissio_deal_types');
    typeGr.addQuery('code', normalized);
    typeGr.addQuery('is_active', true);
    typeGr.setLimit(1);
    typeGr.query();
    if (!typeGr.next()) {
        return '';
    }

    return typeGr.getUniqueValue();
}

function isActiveFlag(value) {
    if (value === true || value === 1) {
        return true;
    }

    var normalized = (value || '').toString().toLowerCase();
    return normalized === 'true' || normalized === '1';
}

function getPayoutSchedule(paymentDateValue, recognitionBasis) {
    var fallback = {
        payout_eligible_date: paymentDateValue,
        snapshot: 'mode=fallback;basis=' + (recognitionBasis || 'cash_received') + ';eligible=' + paymentDateValue
    };

    if (!paymentDateValue) {
        return fallback;
    }

    try {
        var mode = (gs.getProperty('x_823178_commissio.payout_schedule_mode', 'cycle') || 'cycle').toLowerCase();
        var paymentDate = new GlideDateTime();
        paymentDate.setValue(paymentDateValue);

        if (mode === 'days') {
            var waitDays = parseInt(gs.getProperty('x_823178_commissio.payout_wait_days', '28'), 10);
            if (isNaN(waitDays) || waitDays < 0) waitDays = 28;

            var byDays = new GlideDateTime(paymentDate);
            byDays.addDaysUTC(waitDays);
            var byDaysDate = toDateString(byDays);

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

        var nextCycleStart = new GlideDateTime(anchorDate);
        while (!nextCycleStart.after(paymentDate)) {
            nextCycleStart.addDaysUTC(cycleDays);
        }

        var payoutDate = new GlideDateTime(nextCycleStart);
        payoutDate.addDaysUTC((cyclesAfterPayment - 1) * cycleDays);
        var payoutDateValue = toDateString(payoutDate);

        return {
            payout_eligible_date: payoutDateValue,
            snapshot: 'mode=cycle;basis=' + (recognitionBasis || 'cash_received') + ';cycle_days=' + cycleDays + ';cycles_after=' + cyclesAfterPayment + ';anchor=' + anchorDateRaw + ';eligible=' + payoutDateValue
        };
    } catch (e) {
        gs.error('Commission Management: Failed to compute payout schedule - ' + e.message);
        return fallback;
    }
}

function toDateString(dateTime) {
    var value = dateTime ? dateTime.getValue() : '';
    if (!value) return '';
    return value.substring(0, 10);
}

function checkApprovedOverride(recordId, requestType) {
    return getApprovedOverrideJustification(recordId, requestType);
}

export function validatePaymentData(current, previous) {
    // Validate required fields
    if (!current.getValue('books_payment_id')) {
        gs.addErrorMessage('Books Payment ID is required');
        current.setAbortAction(true);
        return;
    }
    
    if (!current.getValue('invoice')) {
        gs.addErrorMessage('Invoice reference is required');
        current.setAbortAction(true);
        return;
    }
    
    // Enhanced duplicate prevention
    var gr = new GlideRecord('x_823178_commissio_payments');
    gr.addQuery('books_payment_id', current.getValue('books_payment_id'));
    gr.addQuery('sys_id', '!=', current.sys_id);
    gr.query();
    
    if (gr.next()) {
        gs.addErrorMessage('DUPLICATE PREVENTION: Books Payment ID ' + current.getValue('books_payment_id') + ' already exists');
        current.setAbortAction(true);
        return;
    }
    
    // BUSINESS REQUIREMENT: Payment amount validation with business flexibility
    var paymentAmount = parseFloat(current.getValue('payment_amount')) || 0;
    if (paymentAmount === 0) {
        gs.addErrorMessage('Payment amount cannot be zero');
        current.setAbortAction(true);
        return;
    }
    
    // Check for high-value payment approval
    var maxPaymentAmount = parseFloat(gs.getProperty('x_823178_commissio.max_payment_amount', '5000000'));
    if (Math.abs(paymentAmount) > maxPaymentAmount) {
        var approvedHighPayment = checkApprovedOverride(current.sys_id, 'high_value_payment');
        if (!approvedHighPayment) {
            gs.addErrorMessage('Payment amount $' + Math.abs(paymentAmount).toFixed(0) + ' exceeds maximum limit $' + maxPaymentAmount.toFixed(0) + ' - requires exception approval');
            current.setAbortAction(true);
            return;
        } else {
            gs.addInfoMessage('HIGH VALUE PAYMENT APPROVED: Processing approved via exception process');
        }
    }
    
    // BUSINESS REQUIREMENT: Flexible payment date validation
    if (current.getValue('payment_date')) {
        var paymentDate = new GlideDateTime();
        paymentDate.setValue(current.getValue('payment_date'));
        var futureLimit = new GlideDateTime();
        futureLimit.addDaysUTC(7); // Allow up to 7 days in future for business flexibility
        
        if (paymentDate.after(futureLimit)) {
            var approvedFuturePayment = checkApprovedOverride(current.sys_id, 'future_payment_date');
            if (!approvedFuturePayment) {
                gs.addErrorMessage('Payment date cannot be more than 7 days in the future without approval');
                current.setAbortAction(true);
                return;
            }
        }
        
        var pastLimit = new GlideDateTime();
        pastLimit.addYearsUTC(-5); // Reasonable limit for historical payments
        
        if (paymentDate.before(pastLimit)) {
            gs.addErrorMessage('Payment date cannot be more than 5 years in the past');
            current.setAbortAction(true);
            return;
        }
    }
}