import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['d809d04821504bc388db41c845e077c6'],
    description: 'Only commission admins can execute bulk plan assignment runs',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_bulk_plan_assignment_runs',
})
