import { List } from '@servicenow/sdk/core'

List({
    table: 'x_823178_commissio_commission_calculations',
    view: 'sys_ref_list',
    columns: ['sys_id'],
})
