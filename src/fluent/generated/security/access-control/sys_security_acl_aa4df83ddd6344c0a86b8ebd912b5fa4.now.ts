import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['aa4df83ddd6344c0a86b8ebd912b5fa4'],
    description: 'Only commission admins can create/update recognition basis policies',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_plan_recognition_policies',
})
