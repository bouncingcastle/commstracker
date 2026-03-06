import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['ce3920c6e22f47aa9af0ede638a4fa64'],
    description: 'Only commission admins can read bulk plan assignment run records',
    type: 'record',
    operation: 'read',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_bulk_plan_assignment_runs',
})
