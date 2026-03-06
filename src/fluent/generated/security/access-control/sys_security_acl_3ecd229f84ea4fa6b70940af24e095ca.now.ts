import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['3ecd229f84ea4fa6b70940af24e095ca'],
    description: 'Only commission admins can create/update plan bonus records',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_plan_bonuses',
})
