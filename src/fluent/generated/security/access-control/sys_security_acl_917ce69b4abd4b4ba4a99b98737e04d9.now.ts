import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['917ce69b4abd4b4ba4a99b98737e04d9'],
    description: 'Only commission admins can create/update recognition basis policies',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_plan_recognition_policies',
})
