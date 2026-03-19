import { List } from '@servicenow/sdk/core'

List({
    table: 'x_823178_commissio_plan_targets',
    view: 'sys_ref_list',
    columns: ['sys_id'],
})
