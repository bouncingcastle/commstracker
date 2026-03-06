import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['8357fc97f19d4235a8936e2da3f07a3c'],
    description: 'Only commission admins can create/update plan bonus records',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_plan_bonuses',
})
