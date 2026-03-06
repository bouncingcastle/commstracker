import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['fb2870da4e564b75a6ea3257970fcc41'],
    description: 'Only commission admins can create/update plan target records',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_plan_targets',
})
