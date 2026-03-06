import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['3d4bcdfede004afba0dd3a9b7c518846'],
    description: 'Only commission admins can read plan recognition policy records',
    type: 'record',
    operation: 'read',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_plan_recognition_policies',
})
