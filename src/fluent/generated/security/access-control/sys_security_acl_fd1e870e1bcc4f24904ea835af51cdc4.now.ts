import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['fd1e870e1bcc4f24904ea835af51cdc4'],
    description: 'Only commission admins can execute bulk plan assignment runs',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_bulk_plan_assignment_runs',
})
