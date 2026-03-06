import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['cea417bdeff543b3a314ebd5ef1083d8'],
    description: 'Only commission admins can execute bulk plan assignment runs',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_bulk_plan_assignment_runs',
})
