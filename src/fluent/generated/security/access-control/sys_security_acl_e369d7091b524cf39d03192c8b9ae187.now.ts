import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['e369d7091b524cf39d03192c8b9ae187'],
    description: 'Only commission admins can create/update recognition basis policies',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_plan_recognition_policies',
})
