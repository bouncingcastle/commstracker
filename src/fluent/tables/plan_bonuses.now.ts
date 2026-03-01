import '@servicenow/sdk/global'
import { Table, StringColumn, DecimalColumn, ReferenceColumn, BooleanColumn } from '@servicenow/sdk/core'

export const x_823178_commissio_plan_bonuses = Table({
    name: 'x_823178_commissio_plan_bonuses',
    label: 'Plan Bonuses',
    schema: {
        commission_plan: ReferenceColumn({
            label: 'Commission Plan',
            referenceTable: 'x_823178_commissio_commission_plans',
            mandatory: true
        }),
        bonus_name: StringColumn({
            label: 'Bonus Name',
            maxLength: 120,
            mandatory: true
        }),
        bonus_amount: DecimalColumn({
            label: 'Bonus Amount',
            precision: 14,
            scale: 2,
            mandatory: true
        }),
        bonus_trigger: StringColumn({
            label: 'Bonus Trigger',
            maxLength: 500
        }),
        deal_type: StringColumn({
            label: 'Deal Type',
            maxLength: 40,
            default: 'any'
        }),
        is_discretionary: BooleanColumn({
            label: 'Discretionary',
            default: false
        }),
        payout_frequency: StringColumn({
            label: 'Payout Frequency',
            choices: {
                info_only: { label: 'Info Only (No Auto-Payout)', sequence: 0 },
                quarterly: { label: 'Quarterly', sequence: 1 },
                annual: { label: 'Annual', sequence: 2 }
            },
            default: 'info_only'
        }),
        auto_payout: BooleanColumn({
            label: 'Auto Payout',
            default: false
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
            name: 'idx_plan_bonus_plan_name',
            fields: ['commission_plan', 'bonus_name']
        }
    ],
    audit: true,
    accessible_from: 'public',
    caller_access: 'tracking',
    actions: ['create', 'read', 'update', 'delete'],
    allow_web_service_access: true
})
