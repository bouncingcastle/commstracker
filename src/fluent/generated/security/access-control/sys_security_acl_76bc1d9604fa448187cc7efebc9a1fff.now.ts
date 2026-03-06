import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['76bc1d9604fa448187cc7efebc9a1fff'],
    description: 'Only commission admins can read bulk plan assignment run records',
    type: 'record',
    operation: 'read',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_bulk_plan_assignment_runs',
})
