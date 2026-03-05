import '@servicenow/sdk/global'
import { Table, StringColumn, DecimalColumn, IntegerColumn, ReferenceColumn, BooleanColumn } from '@servicenow/sdk/core'

export const x_823178_commissio_plan_tiers = Table({
    name: 'x_823178_commissio_plan_tiers',
    label: 'Plan Tiers',
    schema: {
        commission_plan: ReferenceColumn({
            label: 'Commission Plan',
            referenceTable: 'x_823178_commissio_commission_plans',
            mandatory: true
        }),
        tier_name: StringColumn({
            label: 'Tier Name',
            maxLength: 100,
            mandatory: true
        }),
        attainment_floor_percent: DecimalColumn({
            label: 'Attainment Floor (%)',
            precision: 6,
            scale: 2,
            mandatory: true
        }),
        attainment_ceiling_percent: DecimalColumn({
            label: 'Attainment Ceiling (%)',
            precision: 6,
            scale: 2,
            mandatory: true
        }),
        deal_type: StringColumn({
            label: 'Deal Type Scope',
            maxLength: 40,
            default: 'all'
        }),
        commission_rate_percent: DecimalColumn({
            label: 'Commission Rate (%)',
            precision: 6,
            scale: 2,
            mandatory: true
        }),
        sort_order: IntegerColumn({
            label: 'Sort Order'
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
            name: 'idx_plan_tier_plan_order',
            fields: ['commission_plan', 'sort_order']
        }
    ],
    audit: true,
    accessible_from: 'public',
    caller_access: 'tracking',
    actions: ['create', 'read', 'update', 'delete'],
    allow_web_service_access: true
})
