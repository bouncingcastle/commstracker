import { List } from '@servicenow/sdk/core'

List({
    table: 'x_823178_commissio_deal_types',
    view: 'sys_ref_list',
    columns: ['name'],
})
