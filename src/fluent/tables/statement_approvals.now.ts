import '@servicenow/sdk/global'
import { Table, StringColumn, DateTimeColumn, ReferenceColumn, IntegerColumn } from '@servicenow/sdk/core'

export const x_823178_commissio_statement_approvals = Table({
    name: 'x_823178_commissio_statement_approvals',
    label: 'Statement Approvals',
    schema: {
        statement: ReferenceColumn({
            label: 'Commission Statement',
            referenceTable: 'x_823178_commissio_commission_statements',
            mandatory: true,
            attributes: {
                encode_utf8: false,
            },
        }),
        sales_rep: ReferenceColumn({
            label: 'Sales Rep',
            referenceTable: 'sys_user',
            mandatory: true,
            attributes: {
                encode_utf8: false,
            },
        }),
        status: StringColumn({
            label: 'Workflow Status',
            choices: {
                submitted: { label: 'Submitted', sequence: 0 },
                in_review: { label: 'In Review', sequence: 1 },
                approved: { label: 'Approved', sequence: 2 },
                rejected: { label: 'Rejected', sequence: 3 },
                cancelled: { label: 'Cancelled', sequence: 4 },
            },
            default: 'submitted',
            dropdown: 'dropdown_with_none',
        }),
        current_step: StringColumn({
            label: 'Current Step',
            choices: {
                submission: { label: 'Submission', sequence: 0 },
                finance_review: { label: 'Finance Review', sequence: 1 },
                decision: { label: 'Decision', sequence: 2 },
            },
            default: 'submission',
            dropdown: 'dropdown_with_none',
        }),
        submitted_by: ReferenceColumn({
            label: 'Submitted By',
            referenceTable: 'sys_user',
            attributes: {
                encode_utf8: false,
            },
        }),
        submitted_on: DateTimeColumn({
            label: 'Submitted On',
        }),
        reviewed_by: ReferenceColumn({
            label: 'Reviewed By',
            referenceTable: 'sys_user',
            attributes: {
                encode_utf8: false,
            },
        }),
        reviewed_on: DateTimeColumn({
            label: 'Reviewed On',
        }),
        sla_due_on: DateTimeColumn({
            label: 'SLA Due On',
        }),
        escalated_on: DateTimeColumn({
            label: 'Escalated On',
        }),
        escalation_level: IntegerColumn({
            label: 'Escalation Level',
            default: 0,
        }),
        decision_notes: StringColumn({
            label: 'Decision Notes',
            maxLength: 2000,
        }),
        workflow_history: StringColumn({
            label: 'Workflow History',
            maxLength: 4000,
        }),
    },
    audit: true,
    accessibleFrom: 'public',
    callerAccess: 'tracking',
    actions: ['read', 'update', 'delete', 'create'],
    allowWebServiceAccess: true,
    index: [
        {
            name: 'index',
            unique: false,
            element: 'reviewed_by',
        },
        {
            name: 'index2',
            unique: false,
            element: 'sales_rep',
        },
        {
            name: 'index3',
            unique: false,
            element: 'statement',
        },
        {
            name: 'index4',
            unique: false,
            element: 'submitted_by',
        },
    ],
})
