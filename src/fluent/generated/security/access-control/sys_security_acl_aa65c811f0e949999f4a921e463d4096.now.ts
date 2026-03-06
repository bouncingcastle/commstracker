import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['aa65c811f0e949999f4a921e463d4096'],
    description: 'Only commission admins can create/update plan target records',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_plan_targets',
})
