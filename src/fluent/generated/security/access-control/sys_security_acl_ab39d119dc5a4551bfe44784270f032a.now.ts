import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['ab39d119dc5a4551bfe44784270f032a'],
    description: 'Only commission admins can create/update recognition basis policies',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_plan_recognition_policies',
})
