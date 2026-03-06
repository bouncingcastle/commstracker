import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['1af3f44247174ce0b28923c8a09a4064'],
    description: 'Only commission admins can create/update recognition basis policies',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_plan_recognition_policies',
})
