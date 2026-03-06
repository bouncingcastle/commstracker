import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['8aa3aed9598b4c91a5b3ff0d805a1b1f'],
    description: 'Only commission admins can read bulk plan assignment run records',
    type: 'record',
    operation: 'read',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_bulk_plan_assignment_runs',
})
