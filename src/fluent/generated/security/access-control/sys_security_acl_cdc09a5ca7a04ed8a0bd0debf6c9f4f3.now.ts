import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['cdc09a5ca7a04ed8a0bd0debf6c9f4f3'],
    description: 'Only commission admins can create/update recognition basis policies',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_plan_recognition_policies',
})
