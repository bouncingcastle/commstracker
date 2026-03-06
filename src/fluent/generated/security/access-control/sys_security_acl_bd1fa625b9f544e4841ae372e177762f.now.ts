import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['bd1fa625b9f544e4841ae372e177762f'],
    description: 'Only commission admins can read plan recognition policy records',
    type: 'record',
    operation: 'read',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_plan_recognition_policies',
})
