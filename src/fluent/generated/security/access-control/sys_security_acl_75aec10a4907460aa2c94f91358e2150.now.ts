import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['75aec10a4907460aa2c94f91358e2150'],
    description: 'Only commission admins can create/update recognition basis policies',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_plan_recognition_policies',
})
