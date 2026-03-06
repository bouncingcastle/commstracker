import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['4cab25c5df8e48169276269d5fdd87a2'],
    description: 'Only commission admins can create/update recognition basis policies',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_plan_recognition_policies',
})
