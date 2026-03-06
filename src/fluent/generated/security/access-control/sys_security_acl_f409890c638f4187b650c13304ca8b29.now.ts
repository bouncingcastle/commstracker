import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['f409890c638f4187b650c13304ca8b29'],
    description: 'Only commission admins can read plan target records',
    type: 'record',
    operation: 'read',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_plan_targets',
})
