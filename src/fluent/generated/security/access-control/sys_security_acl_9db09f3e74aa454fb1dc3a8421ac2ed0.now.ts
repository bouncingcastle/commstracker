import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['9db09f3e74aa454fb1dc3a8421ac2ed0'],
    description: 'Only commission admins can create/update recognition basis policies',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_plan_recognition_policies',
})
