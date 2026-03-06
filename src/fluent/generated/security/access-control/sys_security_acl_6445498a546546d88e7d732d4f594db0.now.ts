import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['6445498a546546d88e7d732d4f594db0'],
    description: 'Only commission admins can create/update recognition basis policies',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_plan_recognition_policies',
})
