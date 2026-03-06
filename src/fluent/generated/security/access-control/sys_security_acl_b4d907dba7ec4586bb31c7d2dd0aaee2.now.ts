import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['b4d907dba7ec4586bb31c7d2dd0aaee2'],
    description: 'Only commission admins can create/update recognition basis policies',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_plan_recognition_policies',
})
