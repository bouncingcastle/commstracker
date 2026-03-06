import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['65259ac44b814f9ba9198f2c02e25e8c'],
    description: 'Only commission admins can execute bulk plan assignment runs',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_bulk_plan_assignment_runs',
})
