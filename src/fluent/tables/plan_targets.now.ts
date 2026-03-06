import '@servicenow/sdk/global'
import { Table, StringColumn, DecimalColumn, ReferenceColumn, BooleanColumn } from '@servicenow/sdk/core'

export const x_823178_commissio_plan_targets = Table({
    name: 'x_823178_commissio_plan_targets',
    label: 'Plan Targets',
    schema: {
        commission_plan: ReferenceColumn({
            label: 'Commission Plan',
            referenceTable: 'x_823178_commissio_commission_plans',
            mandatory: true
        }),
        deal_type_ref: ReferenceColumn({
            label: 'Deal Type',
            referenceTable: 'x_823178_commissio_deal_types',
            mandatory: true
        }),
        commission_rate_percent: DecimalColumn({
            label: 'Commission Rate (%)',
            precision: 6,
            scale: 2,
            mandatory: true
        }),
        annual_target_amount: DecimalColumn({
            label: 'Annual Target Amount',
            precision: 14,
            scale: 2,
            mandatory: true
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
            name: 'idx_plan_target_plan_type_ref',
            fields: ['commission_plan', 'deal_type_ref']
        }
    ],
    audit: true,
    accessible_from: 'public',
    caller_access: 'tracking',
    actions: ['create', 'read', 'update', 'delete'],
    allow_web_service_access: true
})
