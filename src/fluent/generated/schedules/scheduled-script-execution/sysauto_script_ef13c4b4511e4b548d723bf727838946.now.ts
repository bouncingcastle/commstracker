import { Record } from '@servicenow/sdk/core'

Record({
    $id: Now.ID['ef13c4b4511e4b548d723bf727838946'],
    table: 'sysauto_script',
    data: {
        active: 'true',
        advanced: 'false',
        conditional: 'false',
        name: 'Daily Commission Reconciliation',
        run_time: '2026-03-01 22:02:30',
        run_type: 'daily',
        script: `import { gs, GlideRecord, GlideDateTime } from '@servicenow/glide'

export function dailyReconciliationCheck() {
    gs.info('Commission Management: Starting daily reconciliation check');
    
    try {
        var reconciliationResults = {
            totalVariances: 0,
            significantVariances: 0,
            errors: 0,
            warnings: 0,
            checkedRecords: 0
        };
        
        // Check payments reconciliation
        checkPaymentReconciliation(reconciliationResults);
        
        // Check commission calculation integrity
        checkCalculationIntegrity(reconciliationResults);
        
        // Check for orphaned records
        checkOrphanedRecords(reconciliationResults);
        
        // Check for duplicate calculations
        checkDuplicateCalculations(reconciliationResults);
        
        // Generate reconciliation report
        generateReconciliationReport(reconciliationResults);
        
        gs.info('Commission Management: Daily reconciliation completed - ' + 
                reconciliationResults.checkedRecords + ' records checked, ' +
                reconciliationResults.errors + ' errors, ' +
                reconciliationResults.warnings + ' warnings');
        
    } catch (e) {
        gs.error('Commission Management: Error during daily reconciliation - ' + e.message);
        createSystemAlert('Daily Reconciliation Failed', e.message, 'critical');
    }
}

function checkPaymentReconciliation(results) {
    // Check for payments without commission calculations (should have them)
    var unprocessedGr = new GlideRecord('x_823178_commissio_payments');
    unprocessedGr.addQuery('commission_calculated', 'calculated');
    unprocessedGr.addNullQuery('commission_calculation_id');
    unprocessedGr.query();
    
    while (unprocessedGr.next()) {
        results.errors++;
        gs.warn('Commission Management: Payment ' + unprocessedGr.getValue('books_payment_id') + 
                ' marked as calculated but no calculation record exists');
        
        // Auto-fix: Reset status to trigger recalculation
        unprocessedGr.setValue('commission_calculated', 'pending');
        unprocessedGr.update();
    }
    
    // Check for calculation amount variances
    var varianceGr = new GlideRecord('x_823178_commissio_commission_calculations');
    varianceGr.addQuery('sys_created_on', '>=', gs.daysAgoStart(1)); // Last 24 hours
    varianceGr.query();
    
    while (varianceGr.next()) {
        results.checkedRecords++;
        
        // Recalculate commission to verify accuracy
        var recalculatedAmount = recalculateCommissionForValidation(varianceGr);
        var currentAmount = parseFloat(varianceGr.getValue('commission_amount'));
        var variance = Math.abs(recalculatedAmount - currentAmount);
        
        if (variance > 0.01) { // More than 1 cent difference
            results.totalVariances++;
            
            if (variance > 100) { // More than $100 difference
                results.significantVariances++;
                gs.error('Commission Management: SIGNIFICANT VARIANCE - Calculation ' + 
                        varianceGr.sys_id + ' has $' + variance.toFixed(2) + ' difference');
                createSystemAlert('Commission Calculation Variance', 
                    'Calculation ID: ' + varianceGr.sys_id + ', Variance: $' + variance.toFixed(2), 'high');
            } else {
                results.warnings++;
                gs.warn('Commission Management: Minor variance - Calculation ' + 
                       varianceGr.sys_id + ' has $' + variance.toFixed(2) + ' difference');
            }
        }
    }
}

function checkCalculationIntegrity(results) {
    // Check for calculations without valid payment references
    var orphanCalcGr = new GlideRecord('x_823178_commissio_commission_calculations');
    orphanCalcGr.addQuery('payment', 'NULL');
    orphanCalcGr.addOrCondition('deal', 'NULL');
    orphanCalcGr.addOrCondition('sales_rep', 'NULL');
    orphanCalcGr.query();
    
    while (orphanCalcGr.next()) {
        results.errors++;
        gs.error('Commission Management: Orphaned calculation found - ID: ' + orphanCalcGr.sys_id);
        
        // Mark as error status
        orphanCalcGr.setValue('status', 'error');
        orphanCalcGr.setValue('notes', 'Orphaned record - missing required references');
        orphanCalcGr.update();
    }
    
    // Check for calculations exceeding limits
    var limitGr = new GlideRecord('x_823178_commissio_commission_calculations');
    limitGr.addQuery('commission_amount', '>', 50000); // $50K limit
    limitGr.addQuery('status', '!=', 'error');
    limitGr.query();
    
    while (limitGr.next()) {
        results.warnings++;
        gs.warn('Commission Management: High commission amount - $' + 
               limitGr.getValue('commission_amount') + ' for calculation ' + limitGr.sys_id);
        
        limitGr.setValue('requires_approval', true);
        limitGr.setValue('notes', 'Flagged for approval - exceeds $50K limit');
        limitGr.update();
    }
}

function checkOrphanedRecords(results) {
    // Check for invoices without valid deal references
    var orphanInvoiceGr = new GlideRecord('x_823178_commissio_invoices');
    orphanInvoiceGr.addQuery('is_mapped', false);
    orphanInvoiceGr.addQuery('sys_created_on', '<', gs.daysAgoStart(2)); // Older than 2 days
    orphanInvoiceGr.query();
    
    var unmappedCount = 0;
    while (orphanInvoiceGr.next()) {
        unmappedCount++;
        results.warnings++;
    }
    
    if (unmappedCount > 0) {
        gs.warn('Commission Management: ' + unmappedCount + ' invoices remain unmapped after 2+ days');
        createSystemAlert('Unmapped Invoices Alert', 
            unmappedCount + ' invoices remain unmapped for more than 2 days', 'medium');
    }
}

function checkDuplicateCalculations(results) {
    // Use GROUP BY to find duplicate calculations for same payment
    var duplicateQuery = new GlideRecord('x_823178_commissio_commission_calculations');
    duplicateQuery.groupBy('payment');
    duplicateQuery.addAggregate('COUNT');
    duplicateQuery.addHaving('COUNT', '>', 1);
    duplicateQuery.query();
    
    while (duplicateQuery.next()) {
        results.errors++;
        var paymentId = duplicateQuery.getValue('payment');
        gs.error('Commission Management: Duplicate calculations found for payment: ' + paymentId);
        
        // Auto-remediation: Keep newest, mark others as error
        var dupGr = new GlideRecord('x_823178_commissio_commission_calculations');
        dupGr.addQuery('payment', paymentId);
        dupGr.orderByDesc('sys_created_on');
        dupGr.query();
        
        var keepFirst = true;
        while (dupGr.next()) {
            if (keepFirst) {
                keepFirst = false;
                continue; // Keep the newest one
            }
            
            dupGr.setValue('status', 'error');
            dupGr.setValue('notes', 'Duplicate calculation - auto-disabled by reconciliation');
            dupGr.update();
        }
        
        createSystemAlert('Duplicate Calculations Detected', 
            'Found and remediated duplicate calculations for payment: ' + paymentId, 'high');
    }
}

function recalculateCommissionForValidation(calculationRecord) {
    try {
        // Get payment and invoice details
        var paymentGr = new GlideRecord('x_823178_commissio_payments');
        if (!paymentGr.get(calculationRecord.getValue('payment'))) {
            return 0;
        }
        
        var invoiceGr = new GlideRecord('x_823178_commissio_invoices');
        if (!invoiceGr.get(paymentGr.getValue('invoice'))) {
            return 0;
        }
        
        // Recalculate using same logic as original calculation
        var invoiceSubtotal = parseFloat(invoiceGr.getValue('subtotal')) || 0;
        var invoiceTotal = parseFloat(invoiceGr.getValue('total_amount')) || 0;
        var paymentAmount = parseFloat(paymentGr.getValue('payment_amount')) || 0;
        var commissionRate = parseFloat(calculationRecord.getValue('commission_rate')) || 0;
        
        var paymentRatio = invoiceTotal > 0 ? Math.min(Math.abs(paymentAmount) / invoiceTotal, 1.0) : 0;
        var commissionBaseAmount = Math.round(invoiceSubtotal * paymentRatio * 100) / 100;
        var commissionAmount = Math.round(commissionBaseAmount * (commissionRate / 100) * 100) / 100;
        
        // Handle negative amounts
        if (paymentGr.getValue('payment_type') === 'refund' || paymentAmount < 0) {
            commissionAmount = -Math.abs(commissionAmount);
        }
        
        return commissionAmount;
    } catch (e) {
        gs.error('Commission Management: Error recalculating for validation - ' + e.message);
        return 0;
    }
}

function generateReconciliationReport(results) {
    // Create reconciliation log entry
    var reportGr = new GlideRecord('x_823178_commissio_reconciliation_log');
    reportGr.initialize();
    reportGr.setValue('reconciliation_date', new GlideDateTime().getDisplayValue());
    reportGr.setValue('records_checked', results.checkedRecords);
    reportGr.setValue('total_variances', results.totalVariances);
    reportGr.setValue('significant_variances', results.significantVariances);
    reportGr.setValue('errors_found', results.errors);
    reportGr.setValue('warnings_found', results.warnings);
    reportGr.setValue('status', results.errors > 0 ? 'failed' : (results.warnings > 0 ? 'warning' : 'passed'));
    reportGr.insert();
    
    // Send notification if significant issues found
    if (results.errors > 0 || results.significantVariances > 0) {
        sendReconciliationAlert(results);
    }
}

function createSystemAlert(title, message, severity) {
    try {
        var alertGr = new GlideRecord('x_823178_commissio_system_alerts');
        alertGr.initialize();
        alertGr.setValue('title', title);
        alertGr.setValue('message', message);
        alertGr.setValue('severity', severity);
        alertGr.setValue('alert_date', new GlideDateTime().getDisplayValue());
        alertGr.setValue('status', 'open');
        alertGr.insert();
    } catch (e) {
        gs.error('Commission Management: Failed to create system alert - ' + e.message);
    }
}

function sendReconciliationAlert(results) {
    // Send email to finance team about reconciliation issues
    var message = 'Commission Management Daily Reconciliation Issues:\\n\\n';
    message += 'Records Checked: ' + results.checkedRecords + '\\n';
    message += 'Errors Found: ' + results.errors + '\\n';
    message += 'Total Variances: ' + results.totalVariances + '\\n';
    message += 'Significant Variances (>$100): ' + results.significantVariances + '\\n';
    message += 'Warnings: ' + results.warnings + '\\n\\n';
    message += 'Please review the Commission Management system for details.';
    
    gs.eventQueue('commission.reconciliation.alert', null, message);
}`,
        upgrade_safe: 'false',
    },
})
