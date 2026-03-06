import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['3ec2a9e4acb14a8ea2b2a6f125884a73'],
    description: 'Only commission admins can read plan recognition policy records',
    type: 'record',
    operation: 'read',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_plan_recognition_policies',
})
