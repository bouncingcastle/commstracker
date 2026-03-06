import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['e960276b24bd4108ab453da900c126a8'],
    description: 'Only commission admins can read bulk plan assignment run records',
    type: 'record',
    operation: 'read',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_bulk_plan_assignment_runs',
})
