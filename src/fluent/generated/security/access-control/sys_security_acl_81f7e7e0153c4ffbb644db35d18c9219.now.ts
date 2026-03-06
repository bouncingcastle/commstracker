import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['81f7e7e0153c4ffbb644db35d18c9219'],
    description: 'Only commission admins can read plan target records',
    type: 'record',
    operation: 'read',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_plan_targets',
})
