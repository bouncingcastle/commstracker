import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['da4e5cf396314900a8c814d60b7bb940'],
    description: 'Only commission admins can read plan recognition policy records',
    type: 'record',
    operation: 'read',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_plan_recognition_policies',
})
