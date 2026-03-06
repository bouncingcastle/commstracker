import { List } from '@servicenow/sdk/core'

List({
    table: 'x_823178_commissio_commission_plans',
    view: 'sys_ref_list',
    columns: ['sys_id'],
})
