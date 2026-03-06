import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['83972ab3a9064af58d71b3e7088c0a53'],
    description: 'Only commission admins can read plan recognition policy records',
    type: 'record',
    operation: 'read',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_plan_recognition_policies',
})
