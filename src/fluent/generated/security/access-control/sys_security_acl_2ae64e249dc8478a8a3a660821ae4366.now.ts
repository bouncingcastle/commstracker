import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['2ae64e249dc8478a8a3a660821ae4366'],
    description: 'Only commission admins can read plan recognition policy records',
    type: 'record',
    operation: 'read',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_plan_recognition_policies',
})
