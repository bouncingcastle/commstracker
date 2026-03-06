import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['4f366c15b34240f5830bb71a0b6368e3'],
    description: 'Only commission admins can read plan recognition policy records',
    type: 'record',
    operation: 'read',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_plan_recognition_policies',
})
