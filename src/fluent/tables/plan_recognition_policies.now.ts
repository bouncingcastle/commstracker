import '@servicenow/sdk/global'
import { Table, StringColumn, IntegerColumn, DateColumn, ReferenceColumn, BooleanColumn } from '@servicenow/sdk/core'

export const x_823178_commissio_plan_recognition_policies = Table({
    name: 'x_823178_commissio_plan_recognition_policies',
    label: 'Plan Recognition Policies',
    schema: {
        commission_plan: ReferenceColumn({
            label: 'Commission Plan',
            referenceTable: 'x_823178_commissio_commission_plans',
            mandatory: true
        }),
        version_number: IntegerColumn({
            label: 'Policy Version',
            mandatory: true
        }),
        recognition_basis: StringColumn({
            label: 'Recognition Basis',
            choices: {
                cash_received: { label: 'Cash Received', sequence: 0 },
                invoice_issued: { label: 'Invoice Issued', sequence: 1 },
                booking: { label: 'Booking', sequence: 2 },
                milestone: { label: 'Milestone', sequence: 3 }
            },
            default: 'cash_received',
            mandatory: true
        }),
        effective_start_date: DateColumn({
            label: 'Effective Start Date',
            mandatory: true
        }),
        effective_end_date: DateColumn({
            label: 'Effective End Date'
        }),
        is_active: BooleanColumn({
            label: 'Active',
            default: true
        }),
        description: StringColumn({
            label: 'Description',
            maxLength: 500
        })
    },
    indexes: [
        {
            name: 'idx_plan_recognition_policy_plan_version',
            fields: ['commission_plan', 'version_number']
        },
        {
            name: 'idx_plan_recognition_policy_effective_dates',
            fields: ['commission_plan', 'effective_start_date', 'effective_end_date']
        }
    ],
    audit: true,
    accessible_from: 'public',
    caller_access: 'tracking',
    actions: ['create', 'read', 'update', 'delete'],
    allow_web_service_access: true
})
