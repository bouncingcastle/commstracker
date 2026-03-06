import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['337f4afa0d38464f85d5afe5eb22e830'],
    description: 'Only commission admins can read plan recognition policy records',
    type: 'record',
    operation: 'read',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_plan_recognition_policies',
})
