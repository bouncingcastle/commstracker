import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['ace8593e9ddc40ab8f8047556f872d8b'],
    description: 'Only commission admins can execute bulk plan assignment runs',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_bulk_plan_assignment_runs',
})
