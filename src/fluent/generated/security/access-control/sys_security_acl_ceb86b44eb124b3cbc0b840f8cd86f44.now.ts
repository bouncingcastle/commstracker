import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['ceb86b44eb124b3cbc0b840f8cd86f44'],
    description: 'Only commission admins can execute bulk plan assignment runs',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_bulk_plan_assignment_runs',
})
