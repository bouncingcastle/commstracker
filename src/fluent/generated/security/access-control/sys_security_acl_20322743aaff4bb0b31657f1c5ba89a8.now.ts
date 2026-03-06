import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['20322743aaff4bb0b31657f1c5ba89a8'],
    description: 'Only commission admins can create/update plan target records',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_plan_targets',
})
