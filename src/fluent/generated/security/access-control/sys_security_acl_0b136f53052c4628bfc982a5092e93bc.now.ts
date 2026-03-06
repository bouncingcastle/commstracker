import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['0b136f53052c4628bfc982a5092e93bc'],
    description: 'Only commission admins can read plan target records',
    type: 'record',
    operation: 'read',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_plan_targets',
})
