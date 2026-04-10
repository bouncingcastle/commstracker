import '@servicenow/sdk/global'
import { BusinessRule } from '@servicenow/sdk/core'
import { enforceStatementApprovalWorkflow } from '../../server/business-rules/statement-approval-workflow.js'

BusinessRule({
    $id: Now.ID['statement_approval_workflow_enforcement'],
    name: 'Statement Approval Workflow Enforcement',
    table: 'x_823178_commissio_statement_approvals',
    action: ['insert', 'update'],
    when: 'before',
    script: enforceStatementApprovalWorkflow,
    active: true,
    order: 60,
    description: 'Enforces statement approval transitions and syncs statement status'
})
