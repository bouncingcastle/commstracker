import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['e60d20a3d503457a8fa1278673bc2e72'],
    description: 'Only commission admins can read plan recognition policy records',
    type: 'record',
    operation: 'read',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_plan_recognition_policies',
})
