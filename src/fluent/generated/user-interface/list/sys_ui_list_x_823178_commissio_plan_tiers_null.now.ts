import { List, default_view } from '@servicenow/sdk/core'

List({
    table: 'x_823178_commissio_plan_tiers',
    view: default_view,
    columns: [
        'attainment_floor_percent',
        'commission_plan',
        'commission_rate_percent',
        'description',
        'is_active',
        'sort_order',
        'tier_name',
    ],
})
