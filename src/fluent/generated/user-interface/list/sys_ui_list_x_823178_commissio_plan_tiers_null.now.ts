import { List, default_view } from '@servicenow/sdk/core'

List({
    table: 'x_823178_commissio_plan_tiers',
    view: default_view,
    columns: [
        'attainment_floor_percent',
        'attainment_ceiling_percent',
        'commission_plan',
        'plan_target',
        'commission_rate_percent',
        'is_active',
        'sort_order',
        'tier_name',
    ],
})
