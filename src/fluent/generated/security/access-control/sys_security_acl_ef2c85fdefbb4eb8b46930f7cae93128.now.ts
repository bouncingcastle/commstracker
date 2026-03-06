import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['ef2c85fdefbb4eb8b46930f7cae93128'],
    description: 'Only commission admins can create/update plan tier records',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_plan_tiers',
})
