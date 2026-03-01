import { gs, GlideRecord, GlideDateTime } from '@servicenow/glide'

export function calculateCommissionOnPayment(current, previous) {
    // BUSINESS REQUIREMENT: Prevent duplicate calculations but allow legitimate recalculations
    if (current.getValue('commission_calculated') === 'calculated' && !shouldRecalculate(current)) {
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
            current.setValue('commission_calculated', 'error');
            return;
        }
        
        // Get deal details with validation
        var dealGr = new GlideRecord('x_823178_commissio_deals');
        if (!dealGr.get(invoiceGr.getValue('deal'))) {
            gs.error('Commission Management: Deal not found for invoice');
            current.setValue('commission_calculated', 'error');
            return;
        }
        
        // BUSINESS REQUIREMENT: Deal must be properly closed, but allow processing of approved high-value deals
        if (!dealGr.getValue('is_won') || !dealGr.getValue('snapshot_taken') || !dealGr.getValue('snapshot_timestamp')) {
            gs.warn('Commission Management: Deal is not properly closed or snapshot incomplete');
            current.setValue('commission_calculated', 'error');
            return;
        }
        
        // BUSINESS REQUIREMENT: Check if deal requires approval and is approved
        if (dealGr.getValue('requires_finance_approval') === 'true' && 
            dealGr.getValue('finance_approved') !== 'true') {
            gs.warn('Commission Management: Deal requires finance approval before commission calculation');
            current.setValue('commission_calculated', 'pending');
            return;
        }
        
        // SAFEGUARD: Validate commission owner exists and was active at close
        var commissionOwner = dealGr.getValue('owner_at_close');
        if (!commissionOwner) {
            gs.error('Commission Management: No commission owner in snapshot');
            current.setValue('commission_calculated', 'error');
            return;
        }
        
        var ownerGr = new GlideRecord('sys_user');
        if (!ownerGr.get(commissionOwner)) {
            gs.error('Commission Management: Commission owner not found: ' + commissionOwner);
            current.setValue('commission_calculated', 'error');
            return;
        }
        
        // BUSINESS REQUIREMENT: Use deal close date for all temporal lookups (not current date)
        var closeDate = dealGr.getValue('close_date');
        if (!closeDate) {
            gs.error('Commission Management: Deal has no close date');
            current.setValue('commission_calculated', 'error');
            return;
        }
        
        // Get commission rate from active plan at DEAL CLOSE DATE (not payment date)
        var commissionPlan = getCommissionPlan(commissionOwner, closeDate);
        if (!commissionPlan.planId) {
            // BUSINESS REQUIREMENT: Create exception for missing plans rather than failing
            createMissingPlanException(dealGr, commissionOwner, closeDate);
            gs.warn('Commission Management: No commission plan found - exception created for manual resolution');
            current.setValue('commission_calculated', 'pending');
            return;
        }
        
        var commissionRate = getCommissionRateFromPlan(commissionPlan, dealGr.getValue('deal_type'));
        if (!commissionRate || commissionRate <= 0) {
            gs.error('Commission Management: Invalid commission rate for deal type ' + dealGr.getValue('deal_type'));
            current.setValue('commission_calculated', 'error');
            return;
        }
        
        // BUSINESS REQUIREMENT: Enhanced amount validation preserving business flexibility
        var invoiceSubtotal = parseFloat(invoiceGr.getValue('subtotal')) || 0;
        var invoiceTotal = parseFloat(invoiceGr.getValue('total_amount')) || 0;
        var paymentAmount = parseFloat(current.getValue('payment_amount')) || 0;
        
        if (invoiceSubtotal <= 0 || invoiceTotal <= 0) {
            gs.error('Commission Management: Invalid invoice amounts');
            current.setValue('commission_calculated', 'error');
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
        var commissionAmount = Math.round(commissionBaseAmount * (commissionRate / 100) * 100) / 100;
        
        // Handle refunds (negative amounts)
        var isNegative = current.getValue('payment_type') === 'refund' || paymentAmount < 0;
        if (isNegative) {
            commissionAmount = -Math.abs(commissionAmount);
        }
        
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
                current.setValue('commission_calculated', 'error');
                createHighValueCommissionException(current, commissionAmount, maxCommissionLimit);
                return;
            } else {
                gs.info('Commission Management: High commission approved via exception process');
            }
        }
        
        // BUSINESS REQUIREMENT: Create calculation with comprehensive audit trail
        var payoutSchedule = getPayoutSchedule(current.getValue('payment_date'));
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
            payoutEligibleDate: payoutSchedule.payout_eligible_date,
            payoutScheduleSnapshot: payoutSchedule.snapshot,
            dealCloseDate: closeDate,
            dealType: dealGr.getValue('deal_type'),
            isNegative: isNegative,
            requiresApproval: requiresApproval,
            calculationInputs: {
                invoiceSubtotal: invoiceSubtotal,
                invoiceTotal: invoiceTotal,
                paymentAmount: paymentAmount,
                paymentRatio: paymentRatio,
                planName: commissionPlan.planName,
                payoutSchedule: payoutSchedule
            }
        });
        
        if (calculationId) {
            current.setValue('commission_calculated', 'calculated');
            current.setValue('commission_calculation_id', calculationId);
            current.setValue('calculation_lock', false);
            gs.info('Commission Management: Commission calculated - Amount: $' + commissionAmount.toFixed(2) + 
                   (requiresApproval ? ' (Requires Approval)' : ''));
        } else {
            current.setValue('commission_calculated', 'error');
            gs.error('Commission Management: Failed to create commission calculation');
        }
        
    } catch (e) {
        gs.error('Commission Management: Error calculating commission - ' + e.message);
        current.setValue('commission_calculated', 'error');
        current.setValue('calculation_lock', false);
    }
}

function shouldRecalculate(paymentRecord) {
    // Allow recalculation if specifically requested or if calculation is in error state
    if (paymentRecord.getValue('commission_calculated') === 'error') {
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
            endDate: gr.getValue('effective_end_date'),
            newBusinessRate: parseFloat(gr.getValue('new_business_rate')) || 0,
            renewalRate: parseFloat(gr.getValue('renewal_rate')) || 0,
            expansionRate: parseFloat(gr.getValue('expansion_rate')) || 0,
            upsellRate: parseFloat(gr.getValue('upsell_rate')) || 0,
            baseRate: parseFloat(gr.getValue('base_rate')) || 0
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

function getCommissionRateFromPlan(plan, dealType) {
    switch (dealType) {
        case 'new_business':
            return plan.newBusinessRate || plan.baseRate;
        case 'renewal':
            return plan.renewalRate || plan.baseRate;
        case 'expansion':
            return plan.expansionRate || plan.baseRate;
        case 'upsell':
            return plan.upsellRate || plan.baseRate;
        default:
            return plan.baseRate;
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
    commissionGr.setValue('commission_amount', data.commissionAmount);
    commissionGr.setValue('payment_date', data.paymentDate);
    if (data.payoutEligibleDate) {
        commissionGr.setValue('payout_eligible_date', data.payoutEligibleDate);
    }
    if (data.payoutScheduleSnapshot) {
        commissionGr.setValue('payout_schedule_snapshot', data.payoutScheduleSnapshot);
    }
    commissionGr.setValue('calculation_date', new GlideDateTime().getDisplayValue());
    commissionGr.setValue('deal_close_date', data.dealCloseDate);
    commissionGr.setValue('deal_type', data.dealType);
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

function getPayoutSchedule(paymentDateValue) {
    var fallback = {
        payout_eligible_date: paymentDateValue,
        snapshot: 'mode=fallback;eligible=' + paymentDateValue
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
                snapshot: 'mode=days;wait_days=' + waitDays + ';eligible=' + byDaysDate
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
            snapshot: 'mode=cycle;cycle_days=' + cycleDays + ';cycles_after=' + cyclesAfterPayment + ';anchor=' + anchorDateRaw + ';eligible=' + payoutDateValue
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
    var approvalGr = new GlideRecord('x_823178_commissio_exception_approvals');
    approvalGr.addQuery('reference_record', recordId);
    approvalGr.addQuery('request_type', requestType);
    approvalGr.addQuery('status', 'approved');
    approvalGr.orderByDesc('approval_date');
    approvalGr.setLimit(1);
    approvalGr.query();
    
    if (approvalGr.next()) {
        return approvalGr.getValue('business_justification');
    }
    return false;
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