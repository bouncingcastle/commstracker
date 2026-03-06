import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['b653714595f34a5a89846c10fd61cf25'],
    description: 'Only commission admins can read plan recognition policy records',
    type: 'record',
    operation: 'read',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_plan_recognition_policies',
})
