import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['fd7d506e54254cd892b49df17e9dc6a6'],
    description: 'Only commission admins can execute bulk plan assignment runs',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_bulk_plan_assignment_runs',
})
