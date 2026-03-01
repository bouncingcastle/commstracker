import '@servicenow/sdk/global'
import { Table, StringColumn, DateColumn, DecimalColumn, DateTimeColumn, ReferenceColumn, IntegerColumn, BooleanColumn } from '@servicenow/sdk/core'

// Commission Statements table with web service access
export const x_823178_commissio_commission_statements = Table({
    name: 'x_823178_commissio_commission_statements',
    label: 'Commission Statements',
    schema: {
        statement_number: StringColumn({ 
            label: 'Statement Number',
            maxLength: 50,
            mandatory: true
        }),
        sales_rep: ReferenceColumn({ 
            label: 'Sales Rep',
            referenceTable: 'sys_user',
            mandatory: true
        }),
        statement_month: IntegerColumn({ 
            label: 'Statement Month (1-12)',
            mandatory: true
        }),
        statement_year: IntegerColumn({ 
            label: 'Statement Year',
            mandatory: true
        }),
        period_start_date: DateColumn({ 
            label: 'Period Start Date'
        }),
        period_end_date: DateColumn({ 
            label: 'Period End Date'
        }),
        total_commission_amount: DecimalColumn({ 
            label: 'Total Commission Amount'
        }),
        total_base_commission: DecimalColumn({
            label: 'Total Base Commission'
        }),
        total_accelerator_delta: DecimalColumn({
            label: 'Total Accelerator Delta'
        }),
        total_bonus_amount: DecimalColumn({
            label: 'Total Bonus Amount'
        }),
        total_payments_processed: IntegerColumn({ 
            label: 'Total Payments Processed'
        }),
        status: StringColumn({ 
            label: 'Status',
            choices: {
                draft: { label: 'Draft', sequence: 0 },
                locked: { label: 'Locked', sequence: 1 },
                paid: { label: 'Paid', sequence: 2 },
                disputed: { label: 'Disputed', sequence: 3 }
            },
            default: 'draft'
        }),
        generated_date: DateTimeColumn({ 
            label: 'Generated Date'
        }),
        locked_date: DateTimeColumn({ 
            label: 'Locked Date'
        }),
        locked_by: ReferenceColumn({ 
            label: 'Locked By',
            referenceTable: 'sys_user'
        }),
        paid_date: DateTimeColumn({ 
            label: 'Paid Date'
        }),
        paid_by: ReferenceColumn({ 
            label: 'Paid By',
            referenceTable: 'sys_user'
        }),
        payment_reference: StringColumn({ 
            label: 'Payment Reference',
            maxLength: 100
        }),
        is_auto_generated: BooleanColumn({ 
            label: 'Auto Generated',
            default: true
        }),
        notes: StringColumn({ 
            label: 'Notes',
            maxLength: 1000
        })
    },
    audit: true,
    accessible_from: 'public',
    caller_access: 'tracking',
    actions: ['create', 'read', 'update', 'delete'],
    allow_web_service_access: true
})