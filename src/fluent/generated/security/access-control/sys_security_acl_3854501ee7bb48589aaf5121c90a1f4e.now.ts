import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['3854501ee7bb48589aaf5121c90a1f4e'],
    description: 'Only commission admins can create/update recognition basis policies',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_plan_recognition_policies',
})
