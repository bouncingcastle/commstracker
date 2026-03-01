import '@servicenow/sdk/global'
import { Table, StringColumn, IntegerColumn, DecimalColumn, ReferenceColumn, BooleanColumn } from '@servicenow/sdk/core'

export const x_823178_commissio_forecast_scenarios = Table({
    name: 'x_823178_commissio_forecast_scenarios',
    label: 'Forecast Scenarios',
    schema: {
        scenario_name: StringColumn({
            label: 'Scenario Name',
            maxLength: 120,
            mandatory: true
        }),
        sales_rep: ReferenceColumn({
            label: 'Sales Rep',
            referenceTable: 'sys_user',
            mandatory: true
        }),
        commission_plan: ReferenceColumn({
            label: 'Commission Plan',
            referenceTable: 'x_823178_commissio_commission_plans'
        }),
        scenario_year: IntegerColumn({
            label: 'Scenario Year',
            mandatory: true
        }),
        win_rate_multiplier: DecimalColumn({
            label: 'Win Rate Multiplier',
            precision: 6,
            scale: 2
        }),
        pipeline_multiplier: DecimalColumn({
            label: 'Pipeline Multiplier',
            precision: 6,
            scale: 2
        }),
        projected_revenue: DecimalColumn({
            label: 'Projected Revenue'
        }),
        projected_commission: DecimalColumn({
            label: 'Projected Commission'
        }),
        projected_attainment_percent: DecimalColumn({
            label: 'Projected Attainment (%)',
            precision: 6,
            scale: 2
        }),
        assumptions_json: StringColumn({
            label: 'Assumptions (JSON)',
            maxLength: 4000
        }),
        status: StringColumn({
            label: 'Status',
            choices: {
                draft: { label: 'Draft', sequence: 0 },
                published: { label: 'Published', sequence: 1 },
                archived: { label: 'Archived', sequence: 2 }
            },
            default: 'draft'
        }),
        is_active: BooleanColumn({
            label: 'Active',
            default: true
        }),
        notes: StringColumn({
            label: 'Notes',
            maxLength: 1000
        })
    },
    indexes: [
        {
            name: 'idx_forecast_rep_year',
            fields: ['sales_rep', 'scenario_year']
        }
    ],
    audit: true,
    accessible_from: 'public',
    caller_access: 'tracking',
    actions: ['create', 'read', 'update', 'delete'],
    allow_web_service_access: true
})
