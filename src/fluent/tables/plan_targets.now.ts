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
        deal_type: StringColumn({
            label: 'Deal Type',
            mandatory: true,
            maxLength: 40
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
            name: 'idx_plan_target_plan_type',
            fields: ['commission_plan', 'deal_type']
        }
    ],
    audit: true,
    accessible_from: 'public',
    caller_access: 'tracking',
    actions: ['create', 'read', 'update', 'delete'],
    allow_web_service_access: true
})
