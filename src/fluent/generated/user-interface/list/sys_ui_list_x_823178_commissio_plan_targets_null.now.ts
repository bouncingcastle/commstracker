import { List, default_view } from '@servicenow/sdk/core'

List({
    table: 'x_823178_commissio_plan_targets',
    view: default_view,
    columns: ['annual_target_amount', 'commission_plan', 'deal_type', 'description', 'is_active'],
})
