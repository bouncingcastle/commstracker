import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['3519a84133d54438bfd82071f7c6233c'],
    description: 'Only commission admins can create/update recognition basis policies',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_plan_recognition_policies',
})
