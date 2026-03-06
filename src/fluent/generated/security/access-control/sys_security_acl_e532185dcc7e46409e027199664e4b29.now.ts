import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['e532185dcc7e46409e027199664e4b29'],
    description: 'Only commission admins can execute bulk plan assignment runs',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_bulk_plan_assignment_runs',
})
