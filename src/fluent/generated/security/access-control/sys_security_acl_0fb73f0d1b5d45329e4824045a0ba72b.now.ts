import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['0fb73f0d1b5d45329e4824045a0ba72b'],
    description: 'Only commission admins can create/update recognition basis policies',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_plan_recognition_policies',
})
