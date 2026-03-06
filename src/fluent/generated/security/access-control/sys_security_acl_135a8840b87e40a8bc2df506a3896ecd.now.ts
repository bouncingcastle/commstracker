import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['135a8840b87e40a8bc2df506a3896ecd'],
    description: 'Only commission admins can execute bulk plan assignment runs',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_bulk_plan_assignment_runs',
})
