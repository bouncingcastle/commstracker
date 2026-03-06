import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['5e396de178734c73904eb2474a229ed3'],
    description: 'Only commission admins can create/update recognition basis policies',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_plan_recognition_policies',
})
