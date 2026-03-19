import '@servicenow/sdk/global'
import { Table, StringColumn, DecimalColumn, ReferenceColumn, BooleanColumn } from '@servicenow/sdk/core'

export const x_823178_commissio_plan_bonuses = Table({
    name: 'x_823178_commissio_plan_bonuses',
    label: 'Plan Bonuses',
    schema: {
        commission_plan: ReferenceColumn({
            label: 'Commission Plan',
            referenceTable: 'x_823178_commissio_commission_plans',
            mandatory: true,
            attributes: {
                encode_utf8: false,
            },
        }),
        bonus_name: StringColumn({
            label: 'Bonus Name',
            maxLength: 120,
            mandatory: true,
        }),
        bonus_amount: DecimalColumn({
            label: 'Bonus Amount',
            scale: 2,
            mandatory: true,
        }),
        qualification_metric: StringColumn({
            label: 'Qualification Metric',
            choices: {
                quota_attainment_percent: { label: 'Quota Attainment (%)', sequence: 0 },
                deal_amount: { label: 'Deal Amount', sequence: 1 },
                deal_count: { label: 'Deal Count', sequence: 2 },
                base_commission_amount: { label: 'Base Commission Amount', sequence: 3 },
            },
            default: 'quota_attainment_percent',
            mandatory: true,
            dropdown: 'dropdown_with_none',
        }),
        qualification_operator: StringColumn({
            label: 'Qualification Operator',
            choices: {
                gte: { label: '>=', sequence: 0 },
                gt: { label: '>', sequence: 1 },
                eq: { label: '=', sequence: 2 },
            },
            default: 'gte',
            mandatory: true,
            dropdown: 'dropdown_with_none',
        }),
        qualification_threshold: DecimalColumn({
            label: 'Qualification Threshold',
            scale: 2,
            mandatory: true,
        }),
        evaluation_period: StringColumn({
            label: 'Evaluation Period',
            choices: {
                calculation: { label: 'Per Calculation', sequence: 0 },
                monthly: { label: 'Monthly', sequence: 1 },
                quarterly: { label: 'Quarterly', sequence: 2 },
                annual: { label: 'Annual', sequence: 3 },
            },
            default: 'calculation',
            mandatory: true,
            dropdown: 'dropdown_with_none',
        }),
        one_time_per_period: BooleanColumn({
            label: 'One Time Per Period',
            default: false,
        }),
        condition_summary: StringColumn({
            label: 'Condition Summary',
            maxLength: 500,
            readOnly: true,
        }),
        deal_type_ref: ReferenceColumn({
            label: 'Deal Type',
            referenceTable: 'x_823178_commissio_deal_types',
            attributes: {
                encode_utf8: false,
            },
        }),
        is_discretionary: BooleanColumn({
            label: 'Discretionary',
            default: false,
        }),
        payout_frequency: StringColumn({
            label: 'Payout Frequency',
            choices: {
                info_only: { label: 'Info Only (No Auto-Payout)', sequence: 0 },
                quarterly: { label: 'Quarterly', sequence: 1 },
                annual: { label: 'Annual', sequence: 2 },
            },
            default: 'info_only',
            dropdown: 'dropdown_with_none',
        }),
        auto_payout: BooleanColumn({
            label: 'Auto Payout',
            default: false,
        }),
        bonus_trigger: StringColumn({
            label: 'Bonus Trigger',
            maxLength: 500,
            readOnly: false,
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
            default: 'any',
            choices: {
                new_business: {
                    label: 'New Business',
                    sequence: 1,
                },
                upsell: {
                    label: 'Upsell',
                    sequence: 4,
                },
                renewal: {
                    label: 'Renewal',
                    sequence: 2,
                },
                expansion: {
                    label: 'Expansion',
                    sequence: 3,
                },
                any: {
                    label: 'Any',
                    sequence: 0,
                },
            },
            dropdown: 'dropdown_with_none',
            label: 'Deal Type',
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
