import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['6950461b9a144151a8faf9fa5977db5d'],
    description: 'Only commission admins can execute bulk plan assignment runs',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_bulk_plan_assignment_runs',
})
