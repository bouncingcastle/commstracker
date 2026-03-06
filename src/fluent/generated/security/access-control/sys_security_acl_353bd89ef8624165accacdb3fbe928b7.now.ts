import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['353bd89ef8624165accacdb3fbe928b7'],
    description: 'Only commission admins can read bulk plan assignment run records',
    type: 'record',
    operation: 'read',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_bulk_plan_assignment_runs',
})
