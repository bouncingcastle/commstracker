import { List, default_view } from '@servicenow/sdk/core'

List({
    table: 'x_823178_commissio_deal_types',
    view: default_view,
    columns: ['name', 'code', 'description', 'is_active', 'is_system', 'sort_order'],
})
