import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['b854c6ff1c8a41a1b62305e5bb05a42c'],
    description: 'Only commission admins can execute bulk plan assignment runs',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_bulk_plan_assignment_runs',
})
