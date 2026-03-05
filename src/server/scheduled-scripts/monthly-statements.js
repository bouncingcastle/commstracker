import { gs, GlideRecord, GlideDateTime } from '@servicenow/glide'
import { createSystemAlert } from '../script-includes/ops-governance-utils.js'
import { CALC_STATUS, STATEMENT_STATUS } from '../script-includes/status-model.js'

export function generateMonthlyStatements() {
    gs.info('Commission Management: Starting monthly statement generation');
    
    try {
        // BUSINESS REQUIREMENT: Check for statement freeze period
        var freezeHours = parseInt(gs.getProperty('x_823178_commissio.statement_freeze_hours', '24'));
        var freezeStart = new GlideDateTime();
        freezeStart.addHours(-freezeHours);
        
        // Check for modifications during freeze period
        var recentModifications = checkRecentModifications(freezeStart);
        if (recentModifications.length > 0 && !isEmergencyOverride()) {
            gs.warn('Commission Management: Statement generation blocked - modifications detected during freeze period');
            createFreezeViolationAlert(recentModifications);
            return;
        }
        
        var currentDate = new GlideDateTime();
        var previousMonth = new GlideDateTime();
        previousMonth.addMonthsUTC(-1);
        
        var year = previousMonth.getYear();
        var month = previousMonth.getMonth();
        var monthNumber = month + 1;
        
        // BUSINESS REQUIREMENT: Only include approved calculations
        var repQuery = new GlideRecord('x_823178_commissio_commission_calculations');
        addPayoutEligibilityFilter(repQuery, year, monthNumber);
        repQuery.addQuery('status', 'IN', CALC_STATUS.DRAFT + ',' + CALC_STATUS.LOCKED); // Include draft and locked, exclude disputed/error
        repQuery.addNullQuery('requires_approval').addOrCondition('requires_approval', false)
            .addOrCondition('approved', true); // Only approved high-value calculations
        repQuery.groupBy('sales_rep');
        repQuery.query();
        
        var statementsGenerated = 0;
        var statementsSkipped = 0;
        
        while (repQuery.next()) {
            var salesRep = repQuery.getValue('sales_rep');
            
            // Check if statement already exists for this rep and month
            var existingStatement = new GlideRecord('x_823178_commissio_commission_statements');
            existingStatement.addQuery('sales_rep', salesRep);
            existingStatement.addQuery('statement_year', year);
            existingStatement.addQuery('statement_month', monthNumber);
            existingStatement.query();
            
            if (existingStatement.next()) {
                gs.info('Commission Management: Statement already exists for rep ' + salesRep + ' for ' + monthNumber + '/' + year);
                statementsSkipped++;
                continue;
            }
            
            // BUSINESS REQUIREMENT: Generate statement with business validation
            var statementResult = generateStatementForRep(salesRep, year, monthNumber);
            if (statementResult.success) {
                statementsGenerated++;
            } else {
                gs.warn('Commission Management: Failed to generate statement for rep ' + salesRep + ': ' + statementResult.error);
                createStatementGenerationAlert(salesRep, year, monthNumber, statementResult.error);
            }
        }
        
        gs.info('Commission Management: Statement generation completed - Generated: ' + statementsGenerated + 
                ', Skipped: ' + statementsSkipped);
        
        // Create generation summary
        createGenerationSummary(statementsGenerated, statementsSkipped, year, monthNumber);
        
    } catch (e) {
        gs.error('Commission Management: Error generating monthly statements - ' + e.message);
        createSystemAlert('Monthly Statement Generation Failed', e.message, 'critical');
    }
}

function generateStatementForRep(salesRep, year, month) {
    try {
        // Get all approved commission calculations for this rep and month
        var calcGr = new GlideRecord('x_823178_commissio_commission_calculations');
        calcGr.addQuery('sales_rep', salesRep);
        addPayoutEligibilityFilter(calcGr, year, month);
        calcGr.addQuery('status', 'IN', CALC_STATUS.DRAFT + ',' + CALC_STATUS.LOCKED);
        
        // BUSINESS REQUIREMENT: Only include approved calculations
        calcGr.addNullQuery('requires_approval').addOrCondition('requires_approval', false)
            .addOrCondition('approved', true);
        calcGr.query();
        
        var totalCommission = 0;
        var totalPayments = 0;
        var commissionIds = [];
        var hasUnapprovedCalculations = false;
        var totalBaseCommission = 0;
        var totalAcceleratorDelta = 0;
        var totalBonusAmount = 0;
        
        while (calcGr.next()) {
            // Double-check approval status for high-value items
            if (calcGr.getValue('requires_approval') === 'true' && calcGr.getValue('approved') !== 'true') {
                hasUnapprovedCalculations = true;
                gs.warn('Commission Management: Skipping unapproved calculation: ' + calcGr.sys_id);
                continue;
            }
            
            totalCommission += parseFloat(calcGr.getValue('commission_amount')) || 0;
            totalBaseCommission += parseFloat(calcGr.getValue('base_commission_component')) || 0;
            totalAcceleratorDelta += parseFloat(calcGr.getValue('accelerator_delta_component')) || 0;
            totalBonusAmount += parseFloat(calcGr.getValue('bonus_component')) || 0;
            totalPayments++;
            commissionIds.push(calcGr.sys_id.toString());
        }

        var quarterlyBonus = getQuarterlyBonusPayout(salesRep, year, month);
        var quarterlyBonusAmount = parseFloat(quarterlyBonus.total_bonus_amount) || 0;
        if (quarterlyBonusAmount > 0) {
            totalCommission += quarterlyBonusAmount;
            totalBonusAmount += quarterlyBonusAmount;
        }
        
        if (totalPayments === 0 && quarterlyBonusAmount <= 0) {
            return { success: false, error: 'No approved commission calculations found' };
        }
        
        // BUSINESS REQUIREMENT: Alert if unapproved items exist but don't block statement
        if (hasUnapprovedCalculations) {
            createUnapprovedCalculationAlert(salesRep, year, month);
        }
        
        // Create the statement
        var statementGr = new GlideRecord('x_823178_commissio_commission_statements');
        statementGr.initialize();
        
        // Generate statement number with business format
        var statementNumber = 'COMM-' + year + '-' + padNumber(month) + '-' + salesRep.substring(0, 8);
        
        statementGr.setValue('statement_number', statementNumber);
        statementGr.setValue('sales_rep', salesRep);
        statementGr.setValue('statement_month', month);
        statementGr.setValue('statement_year', year);
        statementGr.setValue('period_start_date', year + '-' + padNumber(month) + '-01');
        statementGr.setValue('period_end_date', getLastDayOfMonth(year, month));
        statementGr.setValue('total_commission_amount', totalCommission);
        statementGr.setValue('total_base_commission', totalBaseCommission);
        statementGr.setValue('total_accelerator_delta', totalAcceleratorDelta);
        statementGr.setValue('total_bonus_amount', totalBonusAmount);
        statementGr.setValue('total_payments_processed', totalPayments);
        statementGr.setValue('status', STATEMENT_STATUS.DRAFT);
        statementGr.setValue('generated_date', new GlideDateTime().getDisplayValue());
        statementGr.setValue('is_auto_generated', true);
        
        // BUSINESS REQUIREMENT: Add business notes for transparency
        var businessNotes = 'Auto-generated statement including ' + totalPayments + ' approved calculations.' +
            ' Breakdown: base $' + totalBaseCommission.toFixed(2) +
            ', accelerator delta $' + totalAcceleratorDelta.toFixed(2) +
            ', bonus $' + totalBonusAmount.toFixed(2) + '.';
        if (quarterlyBonusAmount > 0) {
            businessNotes += ' Included quarterly bonus payout of $' + quarterlyBonusAmount.toFixed(2);
            if (quarterlyBonus.bonuses && quarterlyBonus.bonuses.length) {
                businessNotes += ' (' + quarterlyBonus.bonuses.join(', ') + ').';
            } else {
                businessNotes += '.';
            }
        }
        if (hasUnapprovedCalculations) {
            businessNotes += ' Note: Some high-value calculations pending approval were excluded.';
        }
        statementGr.setValue('notes', businessNotes);
        
        var statementId = statementGr.insert();
        
        if (statementId) {
            // Link commission calculations to the statement
            var linkedCount = 0;
            for (var i = 0; i < commissionIds.length; i++) {
                var commissionGr = new GlideRecord('x_823178_commissio_commission_calculations');
                if (commissionGr.get(commissionIds[i])) {
                    commissionGr.setValue('statement', statementId);
                    commissionGr.setValue('status', CALC_STATUS.LOCKED); // Lock calculations when added to statement
                    commissionGr.update();
                    linkedCount++;
                }
            }
            
            gs.info('Commission Management: Created statement ' + statementNumber + ' for rep ' + salesRep + 
                   ' with ' + linkedCount + ' calculations totaling $' + totalCommission.toFixed(2));
            return { success: true, statementId: statementId };
        }
        
        return { success: false, error: 'Failed to create statement record' };
        
    } catch (e) {
        gs.error('Commission Management: Error generating statement for rep ' + salesRep + ' - ' + e.message);
        return { success: false, error: e.message };
    }
}

function checkRecentModifications(freezeStart) {
    var modifications = [];
    
    // Check for recent calculation modifications
    var calcGr = new GlideRecord('x_823178_commissio_commission_calculations');
    calcGr.addQuery('sys_updated_on', '>=', freezeStart.getDisplayValue());
    calcGr.setLimit(50); // Reasonable limit for analysis
    calcGr.query();
    
    while (calcGr.next()) {
        modifications.push({
            type: 'Commission Calculation',
            record: calcGr.sys_id,
            updated: calcGr.getValue('sys_updated_on'),
            user: calcGr.getValue('sys_updated_by')
        });
    }
    
    return modifications;
}

function isEmergencyOverride() {
    // Check for approved emergency override
    var overrideProperty = gs.getProperty('x_823178_commissio.emergency_statement_override', 'false');
    return overrideProperty === 'true';
}

function createFreezeViolationAlert(modifications) {
    var message = 'Statement generation blocked due to modifications during freeze period:\n';
    for (var i = 0; i < modifications.length && i < 10; i++) {
        message += '- ' + modifications[i].type + ' ' + modifications[i].record + ' by ' + modifications[i].user + '\n';
    }
    if (modifications.length > 10) {
        message += '... and ' + (modifications.length - 10) + ' more modifications';
    }
    
    createSystemAlert('Statement Freeze Violation', message, 'high');
}

function createUnapprovedCalculationAlert(salesRep, year, month) {
    var message = 'Statement generated for ' + salesRep + ' (' + month + '/' + year + ') but some high-value calculations remain unapproved and were excluded.';
    createSystemAlert('Unapproved Calculations in Statement Period', message, 'medium');
}

function createStatementGenerationAlert(salesRep, year, month, error) {
    var message = 'Failed to generate commission statement for rep ' + salesRep + ' for period ' + month + '/' + year + '. Error: ' + error;
    createSystemAlert('Statement Generation Failure', message, 'high');
}

function createGenerationSummary(generated, skipped, year, month) {
    try {
        var summaryGr = new GlideRecord('x_823178_commissio_reconciliation_log');
        summaryGr.initialize();
        summaryGr.setValue('reconciliation_date', new GlideDateTime().getDisplayValue());
        summaryGr.setValue('records_checked', generated + skipped);
        summaryGr.setValue('status', generated > 0 ? 'passed' : 'warning');
        summaryGr.setValue('details', 'Monthly statement generation for ' + month + '/' + year + 
                          ': Generated ' + generated + ', Skipped ' + skipped);
        summaryGr.insert();
    } catch (e) {
        gs.error('Commission Management: Failed to create generation summary - ' + e.message);
    }
}

function padNumber(num) {
    return num < 10 ? '0' + num : '' + num;
}

function getFirstDayOfNextMonth(year, month) {
    if (month === 12) {
        return (year + 1) + '-01-01';
    } else {
        return year + '-' + padNumber(month + 1) + '-01';
    }
}

function getLastDayOfMonth(year, month) {
    var lastDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    
    if (month === 2 && ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0)) {
        return year + '-02-29';
    }
    
    return year + '-' + padNumber(month) + '-' + padNumber(lastDays[month - 1]);
}

function addPayoutEligibilityFilter(gr, year, month) {
    var periodStart = year + '-' + padNumber(month) + '-01';
    var nextPeriodStart = getFirstDayOfNextMonth(year, month);

    gr.addEncodedQuery(
        'payout_eligible_date>=' + periodStart + '^payout_eligible_date<' + nextPeriodStart +
        '^ORpayout_eligible_dateISEMPTY^payment_date>=' + periodStart + '^payment_date<' + nextPeriodStart
    );
}

function getQuarterlyBonusPayout(salesRep, year, month) {
    var result = {
        total_bonus_amount: 0,
        bonuses: []
    };

    if (month !== 3 && month !== 6 && month !== 9 && month !== 12) {
        return result;
    }

    try {
        var quarterStartMonth = month - 2;
        var quarterStartDate = year + '-' + padNumber(quarterStartMonth) + '-01';
        var quarterEndDate = getLastDayOfMonth(year, month);

        var planGr = new GlideRecord('x_823178_commissio_commission_plans');
        planGr.addQuery('sales_rep', salesRep);
        planGr.addQuery('is_active', true);
        planGr.addQuery('effective_start_date', '<=', quarterEndDate);
        planGr.addQuery('effective_end_date', '>=', quarterStartDate).addOrCondition('effective_end_date', '');
        planGr.orderByDesc('effective_start_date');
        planGr.query();

        if (!planGr.next()) {
            return result;
        }

        var bonusGr = new GlideRecord('x_823178_commissio_plan_bonuses');
        bonusGr.addQuery('commission_plan', planGr.getUniqueValue());
        bonusGr.addQuery('is_active', true);
        bonusGr.addQuery('auto_payout', true);
        bonusGr.addQuery('payout_frequency', 'quarterly');
        bonusGr.query();

        while (bonusGr.next()) {
            var amount = parseFloat(bonusGr.getValue('bonus_amount')) || 0;
            if (amount <= 0) continue;
            result.total_bonus_amount += amount;
            result.bonuses.push(bonusGr.getValue('bonus_name') || 'Quarterly bonus');
        }

        return result;
    } catch (e) {
        gs.error('Commission Management: Error calculating quarterly bonus payout for rep ' + salesRep + ' - ' + e.message);
        return result;
    }
}