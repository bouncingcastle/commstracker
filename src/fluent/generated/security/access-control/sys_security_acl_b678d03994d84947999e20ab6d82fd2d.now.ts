import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['b678d03994d84947999e20ab6d82fd2d'],
    description: 'Only commission admins can create/update recognition basis policies',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_plan_recognition_policies',
})
