import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['c33e09bc5f6e4f98b56ea4532b9c2c20'],
    description: 'Only commission admins can create/update plan bonus records',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_plan_bonuses',
})
