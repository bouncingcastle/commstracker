import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['cc16d8a8a15f46f5950a2ebb749128c8'],
    description: 'Only commission admins can execute bulk plan assignment runs',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_bulk_plan_assignment_runs',
})
