import { List, default_view } from '@servicenow/sdk/core'

List({
    table: 'x_823178_commissio_plan_bonuses',
    view: default_view,
    columns: [
        'bonus_amount',
        'bonus_name',
        'bonus_trigger',
        'commission_plan',
        'deal_type',
        'description',
        'is_active',
        'is_discretionary',
    ],
})
