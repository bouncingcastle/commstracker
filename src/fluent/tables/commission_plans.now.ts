import '@servicenow/sdk/global'
import { Table, StringColumn, DecimalColumn, DateColumn, ReferenceColumn, BooleanColumn } from '@servicenow/sdk/core'

export const x_823178_commissio_commission_plans = Table({
    name: 'x_823178_commissio_commission_plans',
    label: 'Commission Plans',
    schema: {
        plan_name: StringColumn({ 
            label: 'Plan Name',
            maxLength: 100,
            mandatory: true
        }),
        sales_rep: ReferenceColumn({ 
            label: 'Sales Rep',
            referenceTable: 'sys_user',
            mandatory: true
        }),
        effective_start_date: DateColumn({ 
            label: 'Effective Start Date',
            mandatory: true
        }),
        effective_end_date: DateColumn({ 
            label: 'Effective End Date'
        }),
        is_active: BooleanColumn({ 
            label: 'Active',
            mandatory: true,
            defaultValue: true
        }),
        deal_type: StringColumn({
            label: 'Deal Type',
            choices: {
                new_business: { label: 'New Business', sequence: 0 },
                renewal: { label: 'Renewal', sequence: 1 },
                expansion: { label: 'Expansion', sequence: 2 },
                upsell: { label: 'Upsell', sequence: 3 }
            },
            defaultValue: 'new_business'
        }),
        new_business_rate: DecimalColumn({ 
            label: 'New Business Rate (%)',
            precision: 5,
            scale: 2,
            mandatory: true
        }),
        renewal_rate: DecimalColumn({ 
            label: 'Renewal Rate (%)',
            precision: 5,
            scale: 2,
            mandatory: true
        }),
        expansion_rate: DecimalColumn({ 
            label: 'Expansion Rate (%)',
            precision: 5,
            scale: 2,
            mandatory: true
        }),
        upsell_rate: DecimalColumn({ 
            label: 'Upsell Rate (%)',
            precision: 5,
            scale: 2,
            mandatory: true
        }),
        base_rate: DecimalColumn({ 
            label: 'Base Rate (%)',
            precision: 5,
            scale: 2,
            mandatory: true
        }),
        description: StringColumn({ 
            label: 'Description',
            maxLength: 500
        }),
        plan_overlap_approved_by: ReferenceColumn({
            label: 'Plan Overlap Approved By',
            referenceTable: 'sys_user'
        }),
        plan_overlap_approved_on: DateColumn({
            label: 'Plan Overlap Approved On'
        }),
        plan_overlap_reason: StringColumn({
            label: 'Plan Overlap Reason',
            maxLength: 500
        })
    },
    indexes: [
        {
            name: 'idx_sales_rep_effective_dates',
            fields: ['sales_rep', 'effective_start_date', 'effective_end_date']
        }
    ]
})