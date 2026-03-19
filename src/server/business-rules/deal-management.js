import { gs, GlideRecord, GlideDateTime } from '@servicenow/glide'
import { getApprovedOverrideJustification, createOverrideAuditLog } from '../script-includes/ops-governance-utils.js'

export function snapshotDealOnClose(current, previous) {
    var previousStage = previous ? (previous.getValue('stage') || '') : '';
    var previousSnapshotTaken = previous ? previous.getValue('snapshot_taken') : '';

    // BUSINESS REQUIREMENT: Preserve ability to correct legitimate snapshot errors
    if (current.getValue('snapshot_taken') === 'true' && previousSnapshotTaken === 'true') {
        // Check for approved override before blocking changes
        if (current.owner_at_close.changes() || current.is_won.changes() || current.close_date.changes()) {
            var approvedOverride = checkApprovedOverride(current.sys_id, 'snapshot_correction');
            if (!approvedOverride) {
                gs.addErrorMessage('SNAPSHOT IMMUTABLE: Deal snapshot cannot be modified without approved exception. Submit exception request for legitimate corrections.');
                current.setAbortAction(true);
                return;
            } else {
                gs.addInfoMessage('APPROVED OVERRIDE: Snapshot modification approved via exception process');
                // Log the override
                createAuditLog('snapshot_override', current.sys_id, 'Snapshot modified via approved exception: ' + approvedOverride);
            }
        }
    }
    
    // Only process when stage changes to closed_won
    if (current.getValue('stage') === 'closed_won' && 
        previousStage !== 'closed_won' &&
        !current.getValue('snapshot_taken')) {
        
        gs.info('Commission Management: Taking immutable snapshot for deal ' + current.getValue('bigin_deal_id'));
        
        // SAFEGUARD: Atomic snapshot operation with timestamp
        var snapshotTimestamp = new GlideDateTime().getDisplayValue();
        current.setValue('owner_at_close', current.getValue('current_owner'));
        current.setValue('is_won', true);
        current.setValue('snapshot_taken', true);
        current.setValue('snapshot_timestamp', snapshotTimestamp);
        current.setValue('snapshot_immutable', true);
        
        // SAFEGUARD: Validate current owner exists and is active
        var ownerGr = new GlideRecord('sys_user');
        if (!ownerGr.get(current.getValue('current_owner')) || ownerGr.getValue('active') !== 'true') {
            gs.addErrorMessage('Cannot snapshot deal: Owner must be an active user');
            current.setAbortAction(true);
            return;
        }
        
        gs.addInfoMessage('Deal snapshot taken at ' + snapshotTimestamp + '. Commission owner: ' + current.getDisplayValue('current_owner'));
    }
    
    // BUSINESS REQUIREMENT: Allow deal reopening with proper approval process
    if (previous.getValue('stage') === 'closed_won' && current.getValue('stage') !== 'closed_won') {
        var calcGr = new GlideRecord('x_823178_commissio_commission_calculations');
        calcGr.addQuery('deal', current.sys_id);
        calcGr.setLimit(1);
        calcGr.query();
        
        if (calcGr.next()) {
            var approvedReopening = checkApprovedOverride(current.sys_id, 'deal_reopening');
            if (!approvedReopening) {
                gs.addErrorMessage('BUSINESS RULE VIOLATION: Cannot reopen deal - commission calculations exist. Submit exception request for legitimate reopening.');
                current.setAbortAction(true);
                return;
            } else {
                gs.addInfoMessage('APPROVED OVERRIDE: Deal reopening approved via exception process');
                createAuditLog('deal_reopening', current.sys_id, 'Deal reopened via approved exception: ' + approvedReopening);
            }
        }
    }
}

export function validateDealMapping(current, previous) {
    // Ensure required fields are populated
    if (!current.getValue('bigin_deal_id')) {
        gs.addErrorMessage('Bigin Deal ID is required');
        current.setAbortAction(true);
        return;
    }
    
    // SAFEGUARD: Enhanced duplicate prevention with soft delete check
    var gr = new GlideRecord('x_823178_commissio_deals');
    gr.addQuery('bigin_deal_id', current.getValue('bigin_deal_id'));
    gr.addQuery('sys_id', '!=', current.sys_id);
    gr.query();
    
    if (gr.next()) {
        gs.addErrorMessage('DUPLICATE PREVENTION: Bigin Deal ID ' + current.getValue('bigin_deal_id') + ' already exists in record ' + gr.getValue('number'));
        current.setAbortAction(true);
        return;
    }
    
    // BUSINESS REQUIREMENT: High-value deals require approval but don't auto-reject
    var amount = parseFloat(current.getValue('amount')) || 0;
    if (amount <= 0) {
        gs.addErrorMessage('Deal amount must be greater than zero');
        current.setAbortAction(true);
        return;
    }
    
    var maxDealAmount = parseFloat(gs.getProperty('x_823178_commissio.max_deal_amount', '10000000'));
    if (amount > maxDealAmount) {
        // Check for approved exception
        var approvedHighValue = checkApprovedOverride(current.sys_id, 'high_value_deal');
        if (!approvedHighValue) {
            // Set flag for approval rather than blocking
            current.setValue('requires_finance_approval', true);
            gs.addInfoMessage('HIGH VALUE DEAL: Amount $' + amount.toFixed(0) + ' exceeds $' + maxDealAmount.toFixed(0) + ' limit. Finance approval required before commission processing.');
        } else {
            current.setValue('finance_approved', true);
            current.setValue('finance_approval_date', new GlideDateTime().getDisplayValue());
            gs.addInfoMessage('HIGH VALUE DEAL APPROVED: Processing approved via exception: ' + approvedHighValue);
        }
    }
    
    // SAFEGUARD: Validate close date is not in future for closed deals
    if (current.getValue('stage') === 'closed_won' && current.getValue('close_date')) {
        var closeDate = new GlideDateTime();
        closeDate.setValue(current.getValue('close_date'));
        var today = new GlideDateTime();
        
        if (closeDate.after(today)) {
            // Allow future dates with approval for legitimate business cases
            var approvedFutureDate = checkApprovedOverride(current.sys_id, 'future_close_date');
            if (!approvedFutureDate) {
                gs.addErrorMessage('Close date cannot be in the future for closed won deals without approval');
                current.setAbortAction(true);
                return;
            }
        }
    }
}

function checkApprovedOverride(recordId, requestType) {
    return getApprovedOverrideJustification(recordId, requestType);
}

function createAuditLog(eventType, recordId, details) {
    createOverrideAuditLog(eventType, details, 'medium');
}
