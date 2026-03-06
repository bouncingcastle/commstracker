import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['f82a645075294968b7e1744a4d419082'],
    description: 'Only commission admins can read bulk plan assignment run records',
    type: 'record',
    operation: 'read',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_bulk_plan_assignment_runs',
})
