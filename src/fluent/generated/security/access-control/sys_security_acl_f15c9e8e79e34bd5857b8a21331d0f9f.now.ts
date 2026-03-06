import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['f15c9e8e79e34bd5857b8a21331d0f9f'],
    description: 'Only commission admins can execute bulk plan assignment runs',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_bulk_plan_assignment_runs',
})
