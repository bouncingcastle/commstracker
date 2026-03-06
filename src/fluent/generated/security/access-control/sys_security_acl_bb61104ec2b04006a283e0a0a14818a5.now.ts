import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['bb61104ec2b04006a283e0a0a14818a5'],
    description: 'Only commission admins can read plan bonus records',
    type: 'record',
    operation: 'read',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_plan_bonuses',
})
