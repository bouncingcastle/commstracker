import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['920dfdc71a3a41c8b912410deb140130'],
    description: 'Only commission admins can read plan recognition policy records',
    type: 'record',
    operation: 'read',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_plan_recognition_policies',
})
