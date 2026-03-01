import '@servicenow/sdk/global'
import { Table, StringColumn, DateTimeColumn, ReferenceColumn } from '@servicenow/sdk/core'

export const x_823178_commissio_statement_approvals = Table({
    name: 'x_823178_commissio_statement_approvals',
    label: 'Statement Approvals',
    schema: {
        statement: ReferenceColumn({
            label: 'Commission Statement',
            referenceTable: 'x_823178_commissio_commission_statements',
            mandatory: true
        }),
        sales_rep: ReferenceColumn({
            label: 'Sales Rep',
            referenceTable: 'sys_user',
            mandatory: true
        }),
        status: StringColumn({
            label: 'Workflow Status',
            choices: {
                submitted: { label: 'Submitted', sequence: 0 },
                in_review: { label: 'In Review', sequence: 1 },
                approved: { label: 'Approved', sequence: 2 },
                rejected: { label: 'Rejected', sequence: 3 },
                cancelled: { label: 'Cancelled', sequence: 4 }
            },
            default: 'submitted'
        }),
        current_step: StringColumn({
            label: 'Current Step',
            choices: {
                submission: { label: 'Submission', sequence: 0 },
                finance_review: { label: 'Finance Review', sequence: 1 },
                decision: { label: 'Decision', sequence: 2 }
            },
            default: 'submission'
        }),
        submitted_by: ReferenceColumn({
            label: 'Submitted By',
            referenceTable: 'sys_user'
        }),
        submitted_on: DateTimeColumn({
            label: 'Submitted On'
        }),
        reviewed_by: ReferenceColumn({
            label: 'Reviewed By',
            referenceTable: 'sys_user'
        }),
        reviewed_on: DateTimeColumn({
            label: 'Reviewed On'
        }),
        decision_notes: StringColumn({
            label: 'Decision Notes',
            maxLength: 2000
        }),
        workflow_history: StringColumn({
            label: 'Workflow History',
            maxLength: 4000
        })
    },
    indexes: [
        {
            name: 'idx_stmt_approval_stmt',
            fields: ['statement', 'status']
        }
    ],
    audit: true,
    accessible_from: 'public',
    caller_access: 'tracking',
    actions: ['create', 'read', 'update', 'delete'],
    allow_web_service_access: true
})
