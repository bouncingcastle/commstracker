import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['321ecd6726124442ab20c44d7421134a'],
    description: 'Only commission admins can read plan recognition policy records',
    type: 'record',
    operation: 'read',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_plan_recognition_policies',
})
