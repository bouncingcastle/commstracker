import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['dcb66cd305414e3da20900ee68ffb58e'],
    description: 'Only commission admins can create/update recognition basis policies',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_plan_recognition_policies',
})
