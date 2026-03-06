import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['05afb973df8e4628935cdd7724cb4b99'],
    description: 'Only commission admins can create/update plan target records',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_plan_targets',
})
