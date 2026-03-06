import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['fec195035cc1444da43e7477b86d852c'],
    description: 'Only commission admins can read bulk plan assignment run records',
    type: 'record',
    operation: 'read',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_bulk_plan_assignment_runs',
})
