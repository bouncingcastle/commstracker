import { gs, GlideRecord, GlideDateTime } from '@servicenow/glide'
import { getApprovedOverrideDetails, createSystemAlert, createOverrideAuditLog } from '../script-includes/ops-governance-utils.js'
import { CALC_STATUS } from '../script-includes/status-model.js'

export function validateCommissionPlan(current, previous) {
    // Validate required fields
    if (!current.getValue('sales_rep')) {
        gs.addErrorMessage('Sales rep is required');
        current.setAbortAction(true);
        return;
    }
    
    if (!current.getValue('effective_start_date')) {
        gs.addErrorMessage('Effective start date is required');
        current.setAbortAction(true);
        return;
    }

    if (!validateLifecycleAndVersion(current)) {
        current.setAbortAction(true);
        return;
    }
    
    // Validate sales rep is active
    var repGr = new GlideRecord('sys_user');
    if (!repGr.get(current.getValue('sales_rep')) || !isTruthyBoolean(repGr.getValue('active'))) {
        gs.addErrorMessage('Sales rep must be an active user');
        current.setAbortAction(true);
        return;
    }
    
    // Validate date logic
    var startDate = new GlideDateTime();
    startDate.setValue(current.getValue('effective_start_date'));
    
    if (current.getValue('effective_end_date')) {
        var endDate = new GlideDateTime();
        endDate.setValue(current.getValue('effective_end_date'));
        
        if (endDate.before(startDate)) {
            gs.addErrorMessage('Effective end date must be after start date');
            current.setAbortAction(true);
            return;
        }
        
        // BUSINESS REQUIREMENT: Allow retroactive end dates with approval
        var today = new GlideDateTime();
        if (endDate.before(today) && isTruthyBoolean(current.getValue('is_active'))) {
            var approvedRetroactive = checkApprovedOverride(current.sys_id, 'retroactive_change');
            if (!approvedRetroactive) {
                gs.addErrorMessage('Cannot set active plan with end date in the past without approval');
                current.setAbortAction(true);
                return;
            } else {
                gs.addInfoMessage('RETROACTIVE CHANGE APPROVED: Plan end date approved via exception process');
            }
        }
    }
    
    // BUSINESS REQUIREMENT: Allow plan modification with approval when calculations exist
    if (previous && previous.sys_id) {
        var calcGr = new GlideRecord('x_823178_commissio_commission_calculations');
        calcGr.addQuery('commission_plan', current.sys_id);
        calcGr.addQuery('status', '!=', CALC_STATUS.DRAFT);
        calcGr.setLimit(1);
        calcGr.query();
        
        if (calcGr.next()) {
            var allowedFields = ['description', 'is_active'];
            var hasDisallowedChanges = false;
            
            var fields = ['effective_start_date', 'effective_end_date', 'sales_rep'];
            
            for (var j = 0; j < fields.length; j++) {
                if (current.getValue(fields[j]) !== previous.getValue(fields[j])) {
                    hasDisallowedChanges = true;
                    break;
                }
            }
            
            if (hasDisallowedChanges) {
                var approvedPlanChange = checkApprovedOverride(current.sys_id, 'plan_modification');
                if (!approvedPlanChange) {
                    gs.addErrorMessage('Cannot modify commission rates or dates - locked commission calculations exist. Submit exception request or create new plan.');
                    current.setAbortAction(true);
                    return;
                } else {
                    gs.addInfoMessage('PLAN MODIFICATION APPROVED: Changes approved via exception process');
                    createAuditLog('plan_modification', current.sys_id, 'Plan modified with existing calculations: ' + approvedPlanChange.business_justification);
                }
            }
        }
    }
}

export function preventOverlapAndGaps(current, previous) {
    var overlapGr = new GlideRecord('x_823178_commissio_commission_plans');
    overlapGr.addQuery('sales_rep', current.getValue('sales_rep'));
    overlapGr.addQuery('sys_id', '!=', current.sys_id);
    overlapGr.addQuery('is_active', true);
    overlapGr.query();
    
    var currentStart = new GlideDateTime();
    currentStart.setValue(current.getValue('effective_start_date'));
    
    var currentEnd = null;
    if (current.getValue('effective_end_date')) {
        currentEnd = new GlideDateTime();
        currentEnd.setValue(current.getValue('effective_end_date'));
    }
    
    var overlaps = [];
    
    while (overlapGr.next()) {
        var existingStart = new GlideDateTime();
        existingStart.setValue(overlapGr.getValue('effective_start_date'));
        
        var existingEnd = null;
        if (overlapGr.getValue('effective_end_date')) {
            existingEnd = new GlideDateTime();
            existingEnd.setValue(overlapGr.getValue('effective_end_date'));
        }
        
        // Check for overlap
        var hasOverlap = false;
        
        if (currentEnd && existingEnd) {
            hasOverlap = currentStart.before(existingEnd) && currentEnd.after(existingStart);
        } else if (currentEnd && !existingEnd) {
            hasOverlap = currentStart.before(existingStart) ? false : true;
        } else if (!currentEnd && existingEnd) {
            hasOverlap = currentStart.before(existingEnd);
        } else {
            hasOverlap = true;
        }
        
        if (hasOverlap) {
            overlaps.push({
                planName: overlapGr.getValue('plan_name'),
                startDate: overlapGr.getValue('effective_start_date'),
                endDate: overlapGr.getValue('effective_end_date') || 'Open-ended',
                planId: overlapGr.sys_id
            });
        }
    }
    
    if (overlaps.length > 0) {
        // BUSINESS REQUIREMENT: Allow approved overlaps for business transitions
        var approvedOverlap = checkApprovedOverride(current.sys_id, 'plan_overlap');
        if (!approvedOverlap) {
            var errorMsg = 'OVERLAP DETECTED: This plan overlaps with existing plan(s): ';
            for (var k = 0; k < overlaps.length; k++) {
                errorMsg += overlaps[k].planName + ' (' + overlaps[k].startDate + ' to ' + overlaps[k].endDate + ')';
                if (k < overlaps.length - 1) errorMsg += ', ';
            }
            errorMsg += '. Submit exception request for business-required overlaps or adjust dates.';
            
            gs.addErrorMessage(errorMsg);
            current.setAbortAction(true);
            return;
        } else {
            gs.addInfoMessage('PLAN OVERLAP APPROVED: Overlap approved for business transition: ' + approvedOverlap.business_justification);
            applyOverlapApprovalMetadata(current, approvedOverlap);
            createAuditLog('approved_overlap', current.sys_id, 'Plan overlap approved: ' + approvedOverlap.business_justification);
        }
    }
    
    // BUSINESS REQUIREMENT: Gap warning but allow for legitimate business reasons
    if (isTruthyBoolean(current.getValue('is_active'))) {
        checkForGaps(current);
    }
}

function checkForGaps(current) {
    var gapGr = new GlideRecord('x_823178_commissio_commission_plans');
    gapGr.addQuery('sales_rep', current.getValue('sales_rep'));
    gapGr.addQuery('sys_id', '!=', current.sys_id);
    gapGr.addQuery('is_active', true);
    gapGr.orderBy('effective_start_date');
    gapGr.query();
    
    var plans = [];
    while (gapGr.next()) {
        plans.push({
            startDate: gapGr.getValue('effective_start_date'),
            endDate: gapGr.getValue('effective_end_date'),
            planName: gapGr.getValue('plan_name')
        });
    }
    
    plans.push({
        startDate: current.getValue('effective_start_date'),
        endDate: current.getValue('effective_end_date'),
        planName: current.getValue('plan_name')
    });
    
    plans.sort(function(a, b) {
        return new GlideDateTime().setValue(a.startDate).compareTo(new GlideDateTime().setValue(b.startDate));
    });
    
    for (var i = 0; i < plans.length - 1; i++) {
        var currentPlanEnd = plans[i].endDate;
        var nextPlanStart = plans[i + 1].startDate;
        
        if (currentPlanEnd && nextPlanStart) {
            var endDate = new GlideDateTime();
            endDate.setValue(currentPlanEnd);
            var startDate = new GlideDateTime();
            startDate.setValue(nextPlanStart);
            
            endDate.addDaysUTC(1);
            
            if (endDate.before(startDate)) {
                // Create exception alert for business review rather than blocking
                createGapException(plans[i], plans[i + 1], current.getValue('sales_rep'));
                gs.addInfoMessage('PLAN GAP DETECTED: Gap between plans requires business review - exception created for resolution.');
            }
        }
    }
}

function createGapException(endingPlan, startingPlan, salesRep) {
    createSystemAlert(
        'Commission Plan Gap Detected',
        'Gap detected between plan "' + endingPlan.planName +
            '" (ends ' + endingPlan.endDate + ') and plan "' + startingPlan.planName +
            '" (starts ' + startingPlan.startDate + ') for sales rep: ' + salesRep,
        'medium',
        'open'
    );
}

function checkApprovedOverride(recordId, requestType) {
    return getApprovedOverrideDetails(recordId, requestType) || false;
}

function applyOverlapApprovalMetadata(current, approval) {
    try {
        if (!approval) return;
        if (approval.approved_by) {
            current.setValue('plan_overlap_approved_by', approval.approved_by);
        }
        if (approval.approval_date) {
            current.setValue('plan_overlap_approved_on', approval.approval_date);
        }
        if (approval.business_justification) {
            current.setValue('plan_overlap_reason', approval.business_justification);
        }
    } catch (e) {
        gs.error('Commission Management: Failed to apply overlap approval metadata - ' + e.message);
    }
}

function createAuditLog(eventType, recordId, details) {
    createOverrideAuditLog(eventType, details, 'low');
}

function isTruthyBoolean(value) {
    var normalized = String(value || '').toLowerCase();
    return normalized === 'true' || normalized === '1';
}

function validateLifecycleAndVersion(current) {
    var lifecycleState = (current.getValue('lifecycle_state') || 'active').toString();
    var supportedStates = {
        draft: true,
        active: true,
        retired: true,
        superseded: true
    };

    if (!supportedStates[lifecycleState]) {
        gs.addErrorMessage('Lifecycle State must be one of: draft, active, retired, superseded.');
        return false;
    }

    var version = parseInt(current.getValue('plan_version'), 10);
    if (isNaN(version) || version <= 0) {
        gs.addErrorMessage('Plan Version must be a positive integer.');
        return false;
    }

    var isActive = isTruthyBoolean(current.getValue('is_active'));
    if (lifecycleState === 'active' && !isActive) {
        gs.addErrorMessage('Lifecycle State "active" requires Active = true.');
        return false;
    }

    if ((lifecycleState === 'retired' || lifecycleState === 'superseded') && isActive) {
        gs.addErrorMessage('Retired/Superseded plans must have Active = false.');
        return false;
    }

    var supersedesPlan = (current.getValue('supersedes_plan') || '').toString();
    if (!supersedesPlan) {
        return true;
    }

    if (supersedesPlan === current.getUniqueValue()) {
        gs.addErrorMessage('A plan cannot supersede itself.');
        return false;
    }

    var priorPlan = new GlideRecord('x_823178_commissio_commission_plans');
    if (!priorPlan.get(supersedesPlan)) {
        gs.addErrorMessage('Supersedes Plan reference is invalid.');
        return false;
    }

    if ((priorPlan.getValue('sales_rep') || '') !== (current.getValue('sales_rep') || '')) {
        gs.addErrorMessage('Superseded plan must belong to the same sales rep.');
        return false;
    }

    var priorVersion = parseInt(priorPlan.getValue('plan_version'), 10) || 0;
    if (version <= priorVersion) {
        gs.addErrorMessage('Plan Version must be greater than the superseded plan version (' + priorVersion + ').');
        return false;
    }

    var priorSupersedes = (priorPlan.getValue('supersedes_plan') || '').toString();
    if (priorSupersedes && priorSupersedes === current.getUniqueValue()) {
        gs.addErrorMessage('Invalid supersede chain detected (cycle).');
        return false;
    }

    return true;
}