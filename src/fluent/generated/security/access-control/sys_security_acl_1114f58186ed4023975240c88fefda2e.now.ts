import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['1114f58186ed4023975240c88fefda2e'],
    description: 'Only commission admins can create/update recognition basis policies',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_plan_recognition_policies',
})
