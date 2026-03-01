import '@servicenow/sdk/global'
import { Table, StringColumn, DateColumn, DecimalColumn, ReferenceColumn, BooleanColumn } from '@servicenow/sdk/core'

export const x_823178_commissio_bonus_earnings = Table({
    name: 'x_823178_commissio_bonus_earnings',
    label: 'Bonus Earnings',
    schema: {
        commission_calculation: ReferenceColumn({
            label: 'Commission Calculation',
            referenceTable: 'x_823178_commissio_commission_calculations',
            mandatory: true
        }),
        payment: ReferenceColumn({
            label: 'Payment',
            referenceTable: 'x_823178_commissio_payments',
            mandatory: true
        }),
        deal: ReferenceColumn({
            label: 'Deal',
            referenceTable: 'x_823178_commissio_deals'
        }),
        invoice: ReferenceColumn({
            label: 'Invoice',
            referenceTable: 'x_823178_commissio_invoices'
        }),
        sales_rep: ReferenceColumn({
            label: 'Sales Rep',
            referenceTable: 'sys_user',
            mandatory: true
        }),
        commission_plan: ReferenceColumn({
            label: 'Commission Plan',
            referenceTable: 'x_823178_commissio_commission_plans',
            mandatory: true
        }),
        plan_bonus: ReferenceColumn({
            label: 'Plan Bonus',
            referenceTable: 'x_823178_commissio_plan_bonuses',
            mandatory: true
        }),
        earned_amount: DecimalColumn({
            label: 'Earned Amount',
            precision: 14,
            scale: 2,
            mandatory: true
        }),
        earned_date: DateColumn({
            label: 'Earned Date',
            mandatory: true
        }),
        period_key: StringColumn({
            label: 'Period Key',
            maxLength: 40,
            mandatory: true
        }),
        evaluation_period: StringColumn({
            label: 'Evaluation Period',
            maxLength: 40,
            mandatory: true
        }),
        one_time_per_period: BooleanColumn({
            label: 'One Time Per Period',
            default: false
        }),
        metric_value_snapshot: DecimalColumn({
            label: 'Metric Value Snapshot',
            precision: 14,
            scale: 4,
            read_only: true
        }),
        threshold_snapshot: DecimalColumn({
            label: 'Threshold Snapshot',
            precision: 14,
            scale: 4,
            read_only: true
        }),
        operator_snapshot: StringColumn({
            label: 'Operator Snapshot',
            maxLength: 20,
            read_only: true
        }),
        qualification_metric_snapshot: StringColumn({
            label: 'Qualification Metric Snapshot',
            maxLength: 80,
            read_only: true
        }),
        evaluation_snapshot: StringColumn({
            label: 'Evaluation Snapshot',
            maxLength: 1000,
            read_only: true
        }),
        status: StringColumn({
            label: 'Status',
            choices: {
                earned: { label: 'Earned', sequence: 0 },
                reversed: { label: 'Reversed', sequence: 1 }
            },
            default: 'earned'
        })
    },
    indexes: [
        {
            name: 'idx_bonus_earnings_calc',
            fields: ['commission_calculation']
        },
        {
            name: 'idx_bonus_earnings_one_time',
            fields: ['plan_bonus', 'sales_rep', 'period_key', 'status']
        },
        {
            name: 'idx_bonus_earnings_payment',
            fields: ['payment']
        }
    ],
    audit: true,
    accessible_from: 'public',
    caller_access: 'tracking',
    actions: ['create', 'read', 'update', 'delete'],
    allow_web_service_access: true
})
