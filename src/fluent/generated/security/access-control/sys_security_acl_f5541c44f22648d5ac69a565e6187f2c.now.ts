import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['f5541c44f22648d5ac69a565e6187f2c'],
    description: 'Only commission admins can read plan tier records',
    type: 'record',
    operation: 'read',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_plan_tiers',
})
