import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['b27ae23eca064d36ab5a087ad2b59671'],
    description: 'Only commission admins can read plan tier records',
    type: 'record',
    operation: 'read',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_plan_tiers',
})
