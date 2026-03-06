import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['34ac7d7b42f64a4ba959bcf2df869e2e'],
    description: 'Only commission admins can execute bulk plan assignment runs',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_bulk_plan_assignment_runs',
})
