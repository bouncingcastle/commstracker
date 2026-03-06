import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['df3d3f1ffe0340a48cbb5b8d6e92f4a4'],
    description: 'Only commission admins can create/update plan bonus records',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_plan_bonuses',
})
