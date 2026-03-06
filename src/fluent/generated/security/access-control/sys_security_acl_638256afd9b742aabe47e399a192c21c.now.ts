import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['638256afd9b742aabe47e399a192c21c'],
    description: 'Only commission admins can create/update recognition basis policies',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_plan_recognition_policies',
})
