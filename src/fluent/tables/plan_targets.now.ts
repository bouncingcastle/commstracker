import '@servicenow/sdk/global'
import { Table, StringColumn, DecimalColumn, ReferenceColumn, BooleanColumn } from '@servicenow/sdk/core'

export const x_823178_commissio_plan_targets = Table({
    name: 'x_823178_commissio_plan_targets',
    label: 'Plan Targets',
    schema: {
        commission_plan: ReferenceColumn({
            label: 'Commission Plan',
            referenceTable: 'x_823178_commissio_commission_plans',
            mandatory: true,
            attributes: {
                encode_utf8: false,
            },
        }),
        deal_type_ref: ReferenceColumn({
            label: 'Deal Type',
            referenceTable: 'x_823178_commissio_deal_types',
            mandatory: true,
            attributes: {
                encode_utf8: false,
            },
        }),
        commission_rate_percent: DecimalColumn({
            label: 'Commission Rate (%)',
            scale: 2,
            mandatory: true,
        }),
        annual_target_amount: DecimalColumn({
            label: 'Annual Target Amount',
            scale: 2,
            mandatory: true,
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
            choices: {
                renewal: {
                    label: 'Renewal',
                    sequence: 1,
                },
                expansion: {
                    label: 'Expansion',
                    sequence: 2,
                },
                upsell: {
                    label: 'Upsell',
                    sequence: 3,
                },
                new_business: {
                    label: 'New Business',
                    sequence: 0,
                },
            },
            dropdown: 'dropdown_with_none',
            label: 'Deal Type',
            mandatory: true,
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
            element: 'deal_type_ref',
        },
    ],
})
