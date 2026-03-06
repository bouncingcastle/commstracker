import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['547dc429e993490aa219c1c0c92adabe'],
    description: 'Only commission admins can create/update plan tier records',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_plan_tiers',
})
