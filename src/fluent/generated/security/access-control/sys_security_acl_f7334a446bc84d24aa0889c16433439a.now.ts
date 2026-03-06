import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['f7334a446bc84d24aa0889c16433439a'],
    description: 'Only commission admins can read bulk plan assignment run records',
    type: 'record',
    operation: 'read',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_bulk_plan_assignment_runs',
})
