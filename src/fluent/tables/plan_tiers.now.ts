import '@servicenow/sdk/global'
import { Table, StringColumn, DecimalColumn, IntegerColumn, ReferenceColumn, BooleanColumn } from '@servicenow/sdk/core'

export const x_823178_commissio_plan_tiers = Table({
    name: 'x_823178_commissio_plan_tiers',
    label: 'Plan Tiers',
    schema: {
        commission_plan: ReferenceColumn({
            label: 'Commission Plan',
            referenceTable: 'x_823178_commissio_commission_plans',
            mandatory: true,
            attributes: {
                encode_utf8: false,
            },
        }),
        plan_target: ReferenceColumn({
            label: 'Plan Target',
            referenceTable: 'x_823178_commissio_plan_targets',
            mandatory: true,
            attributes: {
                encode_utf8: false,
            },
        }),
        tier_name: StringColumn({
            label: 'Tier Name',
            maxLength: 100,
            mandatory: true,
        }),
        attainment_floor_percent: DecimalColumn({
            label: 'Attainment Floor (%)',
            scale: 2,
            mandatory: true,
        }),
        attainment_ceiling_percent: DecimalColumn({
            label: 'Attainment Ceiling (%)',
            scale: 2,
            mandatory: false,
        }),
        commission_rate_percent: DecimalColumn({
            label: 'Commission Rate (%)',
            scale: 2,
            mandatory: true,
        }),
        sort_order: IntegerColumn({
            label: 'Sort Order',
        }),
        is_active: BooleanColumn({
            label: 'Active',
            default: true,
        }),
        description: StringColumn({
            label: 'Description',
            maxLength: 500,
        }),
        deal_type: StringColumn({
            default: 'all',
            label: 'Deal Type Scope',
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
            element: 'plan_target',
        },
    ],
})
