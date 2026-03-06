import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['d7db6914a7ed4119ac64b6df7d0c45fb'],
    description: 'Only commission admins can read bulk plan assignment run records',
    type: 'record',
    operation: 'read',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_bulk_plan_assignment_runs',
})
