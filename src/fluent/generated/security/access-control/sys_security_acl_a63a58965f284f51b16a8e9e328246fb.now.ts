import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['a63a58965f284f51b16a8e9e328246fb'],
    description: 'Only commission admins can execute bulk plan assignment runs',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_bulk_plan_assignment_runs',
})
