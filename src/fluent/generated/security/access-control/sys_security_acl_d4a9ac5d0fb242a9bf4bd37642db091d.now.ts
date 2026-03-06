import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['d4a9ac5d0fb242a9bf4bd37642db091d'],
    description: 'Only commission admins can read bulk plan assignment run records',
    type: 'record',
    operation: 'read',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_bulk_plan_assignment_runs',
})
