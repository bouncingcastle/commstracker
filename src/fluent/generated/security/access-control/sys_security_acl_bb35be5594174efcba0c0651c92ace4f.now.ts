import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['bb35be5594174efcba0c0651c92ace4f'],
    description: 'Only commission admins can create/update recognition basis policies',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_plan_recognition_policies',
})
