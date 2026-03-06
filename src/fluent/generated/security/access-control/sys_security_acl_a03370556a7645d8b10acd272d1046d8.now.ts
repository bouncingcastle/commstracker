import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['a03370556a7645d8b10acd272d1046d8'],
    description: 'Only commission admins can read plan target records',
    type: 'record',
    operation: 'read',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_plan_targets',
})
