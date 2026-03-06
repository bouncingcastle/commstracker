import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['b22462f9f9c0499cbc0c20cef0e31915'],
    description: 'Only commission admins can read bulk plan assignment run records',
    type: 'record',
    operation: 'read',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_bulk_plan_assignment_runs',
})
