import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['3de89e7d3a9c4a5189da06ce6ddf1d0f'],
    description: 'Only commission admins can read bulk plan assignment run records',
    type: 'record',
    operation: 'read',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_bulk_plan_assignment_runs',
})
