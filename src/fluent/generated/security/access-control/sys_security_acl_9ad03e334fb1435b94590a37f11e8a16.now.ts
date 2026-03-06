import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['9ad03e334fb1435b94590a37f11e8a16'],
    description: 'Only commission admins can execute bulk plan assignment runs',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_bulk_plan_assignment_runs',
})
