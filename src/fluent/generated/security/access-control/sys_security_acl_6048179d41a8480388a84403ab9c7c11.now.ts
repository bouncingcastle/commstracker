import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['6048179d41a8480388a84403ab9c7c11'],
    description: 'Only commission admins can read bulk plan assignment run records',
    type: 'record',
    operation: 'read',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_bulk_plan_assignment_runs',
})
