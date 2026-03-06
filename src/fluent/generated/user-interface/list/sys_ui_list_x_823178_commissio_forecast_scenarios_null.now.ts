import { List, default_view } from '@servicenow/sdk/core'

List({
    table: 'x_823178_commissio_forecast_scenarios',
    view: default_view,
    columns: [
        'assumptions_json',
        'commission_plan',
        'is_active',
        'notes',
        'pipeline_multiplier',
        'projected_attainment_percent',
        'projected_commission',
        'projected_revenue',
        'sales_rep',
        'scenario_name',
    ],
})
