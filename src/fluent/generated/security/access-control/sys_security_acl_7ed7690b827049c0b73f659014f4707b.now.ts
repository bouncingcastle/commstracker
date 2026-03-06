import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['7ed7690b827049c0b73f659014f4707b'],
    description: 'Only commission admins can create/update recognition basis policies',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_plan_recognition_policies',
})
