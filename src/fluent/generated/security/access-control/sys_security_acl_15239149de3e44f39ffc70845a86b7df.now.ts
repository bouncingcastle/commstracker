import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['15239149de3e44f39ffc70845a86b7df'],
    description: 'Only commission admins can create/update plan bonus records',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_plan_bonuses',
})
