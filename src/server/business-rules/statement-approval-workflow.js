import { gs, GlideRecord, GlideDateTime } from '@servicenow/glide'
import { APPROVAL_STATUS, STATEMENT_STATUS, isApprovalTransitionAllowed } from '../script-includes/status-model.js'
import { hasStatementReviewerAccess } from '../script-includes/role-access-model.js'

export function enforceStatementApprovalWorkflow(current, previous) {
    var now = new GlideDateTime().getDisplayValue()
    var nextStatus = current.getValue('status') || APPROVAL_STATUS.SUBMITTED

    if (!current.getValue('submitted_by')) {
        current.setValue('submitted_by', gs.getUserID())
    }
    if (!current.getValue('submitted_on')) {
        current.setValue('submitted_on', now)
    }
    setDefaultSlaIfMissing(current)

    if (!previous || !previous.sys_id) {
        current.setValue('status', nextStatus || APPROVAL_STATUS.SUBMITTED)
        current.setValue('current_step', getStepForStatus(nextStatus || APPROVAL_STATUS.SUBMITTED))
        appendWorkflowHistory(current, 'created', nextStatus || APPROVAL_STATUS.SUBMITTED)
        return
    }

    var priorStatus = previous.getValue('status') || APPROVAL_STATUS.SUBMITTED
    if (priorStatus === nextStatus) {
        return
    }

    if (!isApprovalTransitionAllowed(priorStatus, nextStatus)) {
        gs.addErrorMessage('Invalid statement approval transition: ' + priorStatus + ' → ' + nextStatus)
        current.setAbortAction(true)
        return
    }

    if (nextStatus === APPROVAL_STATUS.IN_REVIEW || nextStatus === APPROVAL_STATUS.APPROVED || nextStatus === APPROVAL_STATUS.REJECTED) {
        if (!hasReviewerRole()) {
            gs.addErrorMessage('Only finance or admin can move approvals into review/decision states')
            current.setAbortAction(true)
            return
        }
    }

    if (nextStatus === APPROVAL_STATUS.APPROVED || nextStatus === APPROVAL_STATUS.REJECTED) {
        current.setValue('reviewed_by', gs.getUserID())
        current.setValue('reviewed_on', now)
    }

    current.setValue('current_step', getStepForStatus(nextStatus))
    appendWorkflowHistory(current, priorStatus, nextStatus)

    syncStatementStatus(current.getValue('statement'), nextStatus)
}

function setDefaultSlaIfMissing(current) {
    if (current.getValue('sla_due_on')) {
        return
    }

    var slaHours = parseInt(gs.getProperty('x_823178_commissio.statement_approval_sla_hours', '48'), 10)
    if (isNaN(slaHours) || slaHours <= 0) {
        slaHours = 48
    }

    var due = new GlideDateTime()
    due.addSeconds(slaHours * 3600)
    current.setValue('sla_due_on', due.getDisplayValue())
}

function hasReviewerRole() {
    return hasStatementReviewerAccess(gs.getUser())
}

function getStepForStatus(status) {
    if (status === APPROVAL_STATUS.SUBMITTED) return 'submission'
    if (status === APPROVAL_STATUS.IN_REVIEW) return 'finance_review'
    if (status === APPROVAL_STATUS.APPROVED || status === APPROVAL_STATUS.REJECTED) return 'decision'
    return 'submission'
}

function appendWorkflowHistory(current, fromStatus, toStatus) {
    var existing = current.getValue('workflow_history') || ''
    var timestamp = new GlideDateTime().getDisplayValue()
    var line = timestamp + ' | ' + gs.getUserDisplayName() + ' | ' + fromStatus + ' -> ' + toStatus
    var next = existing ? (existing + '\n' + line) : line
    current.setValue('workflow_history', next.substring(0, 4000))
}

function syncStatementStatus(statementId, approvalStatus) {
    if (!statementId) return

    var statementGr = new GlideRecord('x_823178_commissio_commission_statements')
    if (!statementGr.get(statementId)) return

    if (approvalStatus === APPROVAL_STATUS.APPROVED) {
        statementGr.setValue('status', STATEMENT_STATUS.LOCKED)
        statementGr.setValue('locked_by', gs.getUserID())
        statementGr.setValue('locked_date', new GlideDateTime().getDisplayValue())
        statementGr.update()
        return
    }

    if (approvalStatus === APPROVAL_STATUS.REJECTED || approvalStatus === APPROVAL_STATUS.CANCELLED) {
        statementGr.setValue('status', STATEMENT_STATUS.DRAFT)
        statementGr.update()
    }
}
