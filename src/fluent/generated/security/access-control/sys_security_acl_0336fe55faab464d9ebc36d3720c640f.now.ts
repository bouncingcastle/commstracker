import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['0336fe55faab464d9ebc36d3720c640f'],
    description: 'Only commission admins can create/update plan tier records',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_plan_tiers',
})
