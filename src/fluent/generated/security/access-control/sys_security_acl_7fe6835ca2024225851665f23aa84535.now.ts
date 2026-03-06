import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['7fe6835ca2024225851665f23aa84535'],
    description: 'Only commission admins can read bulk plan assignment run records',
    type: 'record',
    operation: 'read',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_bulk_plan_assignment_runs',
})
