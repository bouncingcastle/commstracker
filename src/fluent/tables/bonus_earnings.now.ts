import '@servicenow/sdk/global'
import { Table, StringColumn, DateColumn, DecimalColumn, ReferenceColumn, BooleanColumn } from '@servicenow/sdk/core'

export const x_823178_commissio_bonus_earnings = Table({
    name: 'x_823178_commissio_bonus_earnings',
    label: 'Bonus Earnings',
    schema: {
        commission_calculation: ReferenceColumn({
            label: 'Commission Calculation',
            referenceTable: 'x_823178_commissio_commission_calculations',
            mandatory: true,
            attributes: {
                encode_utf8: false,
            },
        }),
        payment: ReferenceColumn({
            label: 'Payment',
            referenceTable: 'x_823178_commissio_payments',
            mandatory: true,
            attributes: {
                encode_utf8: false,
            },
        }),
        deal: ReferenceColumn({
            label: 'Deal',
            referenceTable: 'x_823178_commissio_deals',
            attributes: {
                encode_utf8: false,
            },
        }),
        invoice: ReferenceColumn({
            label: 'Invoice',
            referenceTable: 'x_823178_commissio_invoices',
            attributes: {
                encode_utf8: false,
            },
        }),
        sales_rep: ReferenceColumn({
            label: 'Sales Rep',
            referenceTable: 'sys_user',
            mandatory: true,
            attributes: {
                encode_utf8: false,
            },
        }),
        commission_plan: ReferenceColumn({
            label: 'Commission Plan',
            referenceTable: 'x_823178_commissio_commission_plans',
            mandatory: true,
            attributes: {
                encode_utf8: false,
            },
        }),
        plan_bonus: ReferenceColumn({
            label: 'Plan Bonus',
            referenceTable: 'x_823178_commissio_plan_bonuses',
            mandatory: true,
            attributes: {
                encode_utf8: false,
            },
        }),
        earned_amount: DecimalColumn({
            label: 'Earned Amount',
            scale: 2,
            mandatory: true,
        }),
        earned_date: DateColumn({
            label: 'Earned Date',
            mandatory: true,
        }),
        period_key: StringColumn({
            label: 'Period Key',
            maxLength: 40,
            mandatory: true,
        }),
        evaluation_period: StringColumn({
            label: 'Evaluation Period',
            maxLength: 40,
            mandatory: true,
        }),
        one_time_per_period: BooleanColumn({
            label: 'One Time Per Period',
            default: false,
        }),
        metric_value_snapshot: DecimalColumn({
            label: 'Metric Value Snapshot',
            scale: 4,
            readOnly: true,
        }),
        threshold_snapshot: DecimalColumn({
            label: 'Threshold Snapshot',
            scale: 4,
            readOnly: true,
        }),
        operator_snapshot: StringColumn({
            label: 'Operator Snapshot',
            maxLength: 20,
            readOnly: true,
        }),
        qualification_metric_snapshot: StringColumn({
            label: 'Qualification Metric Snapshot',
            maxLength: 80,
            readOnly: true,
        }),
        evaluation_snapshot: StringColumn({
            label: 'Evaluation Snapshot',
            maxLength: 1000,
            readOnly: true,
        }),
        status: StringColumn({
            label: 'Status',
            choices: {
                earned: { label: 'Earned', sequence: 0 },
                reversed: { label: 'Reversed', sequence: 1 },
            },
            default: 'earned',
            dropdown: 'dropdown_with_none',
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
            element: 'commission_calculation',
        },
        {
            name: 'index2',
            unique: false,
            element: 'commission_plan',
        },
        {
            name: 'index3',
            unique: false,
            element: 'deal',
        },
        {
            name: 'index4',
            unique: false,
            element: 'invoice',
        },
        {
            name: 'index5',
            unique: false,
            element: 'payment',
        },
        {
            name: 'index6',
            unique: false,
            element: 'plan_bonus',
        },
        {
            name: 'index7',
            unique: false,
            element: 'sales_rep',
        },
    ],
})
