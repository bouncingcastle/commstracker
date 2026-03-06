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
        qualification_metric: StringColumn({
            label: 'Qualification Metric',
            choices: {
                quota_attainment_percent: { label: 'Quota Attainment (%)', sequence: 0 },
                deal_amount: { label: 'Deal Amount', sequence: 1 },
                deal_count: { label: 'Deal Count', sequence: 2 },
                base_commission_amount: { label: 'Base Commission Amount', sequence: 3 }
            },
            default: 'quota_attainment_percent',
            mandatory: true
        }),
        qualification_operator: StringColumn({
            label: 'Qualification Operator',
            choices: {
                gte: { label: '>=', sequence: 0 },
                gt: { label: '>', sequence: 1 },
                eq: { label: '=', sequence: 2 }
            },
            default: 'gte',
            mandatory: true
        }),
        qualification_threshold: DecimalColumn({
            label: 'Qualification Threshold',
            precision: 14,
            scale: 2,
            mandatory: true
        }),
        evaluation_period: StringColumn({
            label: 'Evaluation Period',
            choices: {
                calculation: { label: 'Per Calculation', sequence: 0 },
                monthly: { label: 'Monthly', sequence: 1 },
                quarterly: { label: 'Quarterly', sequence: 2 },
                annual: { label: 'Annual', sequence: 3 }
            },
            default: 'calculation',
            mandatory: true
        }),
        one_time_per_period: BooleanColumn({
            label: 'One Time Per Period',
            default: false
        }),
        condition_summary: StringColumn({
            label: 'Condition Summary',
            maxLength: 500,
            read_only: true
        }),
        deal_type_ref: ReferenceColumn({
            label: 'Deal Type',
            referenceTable: 'x_823178_commissio_deal_types'
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
        bonus_trigger: StringColumn({
            label: 'Legacy Bonus Trigger (Deprecated)',
            maxLength: 500,
            read_only: true
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
        },
        {
            name: 'idx_plan_bonus_deal_type_ref',
            fields: ['deal_type_ref']
        }
    ],
    audit: true,
    accessible_from: 'public',
    caller_access: 'tracking',
    actions: ['create', 'read', 'update', 'delete'],
    allow_web_service_access: true
})
