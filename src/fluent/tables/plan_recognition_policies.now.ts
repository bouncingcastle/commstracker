import '@servicenow/sdk/global'
import { Table, StringColumn, IntegerColumn, DateColumn, ReferenceColumn, BooleanColumn } from '@servicenow/sdk/core'

export const x_823178_commissio_plan_recognition_policies = Table({
    name: 'x_823178_commissio_plan_recognition_policies',
    label: 'Plan Recognition Policies',
    schema: {
        commission_plan: ReferenceColumn({
            label: 'Commission Plan',
            referenceTable: 'x_823178_commissio_commission_plans',
            mandatory: true,
            attributes: {
                encode_utf8: false,
            },
        }),
        version_number: IntegerColumn({
            label: 'Policy Version',
            mandatory: true,
        }),
        policy_state: StringColumn({
            label: 'Policy State',
            choices: {
                draft: { label: 'Draft', sequence: 0 },
                active: { label: 'Active', sequence: 1 },
                retired: { label: 'Retired', sequence: 2 },
                superseded: { label: 'Superseded', sequence: 3 },
            },
            default: 'active',
            mandatory: true,
            dropdown: 'dropdown_with_none',
        }),
        supersedes_policy: ReferenceColumn({
            label: 'Supersedes Policy',
            referenceTable: 'x_823178_commissio_plan_recognition_policies',
            attributes: {
                encode_utf8: false,
            },
        }),
        superseded_by_policy: ReferenceColumn({
            label: 'Superseded By Policy',
            referenceTable: 'x_823178_commissio_plan_recognition_policies',
            readOnly: true,
            attributes: {
                encode_utf8: false,
            },
        }),
        recognition_basis: StringColumn({
            label: 'Recognition Basis',
            choices: {
                cash_received: { label: 'Cash Received', sequence: 0 },
                invoice_issued: { label: 'Invoice Issued', sequence: 1 },
                booking: { label: 'Booking', sequence: 2 },
                milestone: { label: 'Milestone', sequence: 3 },
            },
            default: 'cash_received',
            mandatory: true,
            dropdown: 'dropdown_with_none',
        }),
        effective_start_date: DateColumn({
            label: 'Effective Start Date',
            mandatory: true,
        }),
        effective_end_date: DateColumn({
            label: 'Effective End Date',
        }),
        is_active: BooleanColumn({
            label: 'Active',
            default: true,
        }),
        description: StringColumn({
            label: 'Description',
            maxLength: 500,
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
            element: 'commission_plan',
        },
        {
            name: 'index2',
            unique: false,
            element: 'superseded_by_policy',
        },
        {
            name: 'index3',
            unique: false,
            element: 'supersedes_policy',
        },
    ],
})
