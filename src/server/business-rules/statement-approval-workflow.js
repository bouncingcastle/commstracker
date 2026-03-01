import { gs, GlideRecord, GlideDateTime } from '@servicenow/glide'

export function enforceStatementApprovalWorkflow(current, previous) {
    var now = new GlideDateTime().getDisplayValue()
    var nextStatus = current.getValue('status') || 'submitted'

    if (!current.getValue('submitted_by')) {
        current.setValue('submitted_by', gs.getUserID())
    }
    if (!current.getValue('submitted_on')) {
        current.setValue('submitted_on', now)
    }

    if (!previous || !previous.sys_id) {
        current.setValue('status', nextStatus || 'submitted')
        current.setValue('current_step', getStepForStatus(nextStatus || 'submitted'))
        appendWorkflowHistory(current, 'created', nextStatus || 'submitted')
        return
    }

    var priorStatus = previous.getValue('status') || 'submitted'
    if (priorStatus === nextStatus) {
        return
    }

    if (!isTransitionAllowed(priorStatus, nextStatus)) {
        gs.addErrorMessage('Invalid statement approval transition: ' + priorStatus + ' → ' + nextStatus)
        current.setAbortAction(true)
        return
    }

    if (nextStatus === 'in_review' || nextStatus === 'approved' || nextStatus === 'rejected') {
        if (!hasReviewerRole()) {
            gs.addErrorMessage('Only finance or admin can move approvals into review/decision states')
            current.setAbortAction(true)
            return
        }
    }

    if (nextStatus === 'approved' || nextStatus === 'rejected') {
        current.setValue('reviewed_by', gs.getUserID())
        current.setValue('reviewed_on', now)
    }

    current.setValue('current_step', getStepForStatus(nextStatus))
    appendWorkflowHistory(current, priorStatus, nextStatus)

    syncStatementStatus(current.getValue('statement'), nextStatus)
}

function hasReviewerRole() {
    var user = gs.getUser()
    return user.hasRole('admin') || user.hasRole('x_823178_commissio.admin') || user.hasRole('x_823178_commissio.finance')
}

function isTransitionAllowed(fromStatus, toStatus) {
    var transitions = {
        submitted: { in_review: true, cancelled: true },
        in_review: { approved: true, rejected: true, cancelled: true },
        rejected: { in_review: true, cancelled: true },
        approved: {},
        cancelled: {}
    }

    return !!(transitions[fromStatus] && transitions[fromStatus][toStatus])
}

function getStepForStatus(status) {
    if (status === 'submitted') return 'submission'
    if (status === 'in_review') return 'finance_review'
    if (status === 'approved' || status === 'rejected') return 'decision'
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

    if (approvalStatus === 'approved') {
        statementGr.setValue('status', 'locked')
        statementGr.setValue('locked_by', gs.getUserID())
        statementGr.setValue('locked_date', new GlideDateTime().getDisplayValue())
        statementGr.update()
        return
    }

    if (approvalStatus === 'rejected' || approvalStatus === 'cancelled') {
        statementGr.setValue('status', 'draft')
        statementGr.update()
    }
}
