import '@servicenow/sdk/global'
import { Table, StringColumn, DecimalColumn, DateColumn, ReferenceColumn, BooleanColumn, IntegerColumn } from '@servicenow/sdk/core'

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
        lifecycle_state: StringColumn({
            label: 'Lifecycle State',
            choices: {
                draft: { label: 'Draft', sequence: 0 },
                active: { label: 'Active', sequence: 1 },
                retired: { label: 'Retired', sequence: 2 },
                superseded: { label: 'Superseded', sequence: 3 }
            },
            defaultValue: 'active',
            mandatory: true
        }),
        plan_version: IntegerColumn({
            label: 'Plan Version',
            mandatory: true,
            default: 1
        }),
        supersedes_plan: ReferenceColumn({
            label: 'Supersedes Plan',
            referenceTable: 'x_823178_commissio_commission_plans'
        }),
        superseded_by_plan: ReferenceColumn({
            label: 'Superseded By Plan',
            referenceTable: 'x_823178_commissio_commission_plans',
            read_only: true
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
            referenceTable: 'sys_user',
            read_only: true
        }),
        plan_overlap_approved_on: DateColumn({
            label: 'Plan Overlap Approved On',
            read_only: true
        }),
        plan_overlap_reason: StringColumn({
            label: 'Plan Overlap Reason',
            maxLength: 500,
            read_only: true
        })
    },
    indexes: [
        {
            name: 'idx_sales_rep_effective_dates',
            fields: ['sales_rep', 'effective_start_date', 'effective_end_date']
        },
        {
            name: 'idx_plan_rep_active_effective',
            fields: ['sales_rep', 'is_active', 'effective_start_date']
        },
        {
            name: 'idx_plan_lifecycle_active',
            fields: ['lifecycle_state', 'is_active']
        },
        {
            name: 'idx_plan_rep_version',
            fields: ['sales_rep', 'plan_version']
        },
        {
            name: 'idx_plan_supersedes',
            fields: ['supersedes_plan']
        }
    ]
})