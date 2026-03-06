import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['835cd4b9df94431bb78ab884f58bfc5c'],
    description: 'Only commission admins can execute bulk plan assignment runs',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_bulk_plan_assignment_runs',
})
