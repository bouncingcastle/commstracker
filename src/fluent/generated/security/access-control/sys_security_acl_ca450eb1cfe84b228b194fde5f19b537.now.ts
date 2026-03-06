import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['ca450eb1cfe84b228b194fde5f19b537'],
    description: 'Only commission admins can execute bulk plan assignment runs',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_bulk_plan_assignment_runs',
})
