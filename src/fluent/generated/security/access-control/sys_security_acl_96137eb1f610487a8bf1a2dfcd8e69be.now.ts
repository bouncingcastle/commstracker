import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['96137eb1f610487a8bf1a2dfcd8e69be'],
    description: 'Only commission admins can read bulk plan assignment run records',
    type: 'record',
    operation: 'read',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_bulk_plan_assignment_runs',
})
