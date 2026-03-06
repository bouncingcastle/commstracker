import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['f330ca9a3b3044b9bd48ce9da604b9e4'],
    description: 'Only commission admins can read plan recognition policy records',
    type: 'record',
    operation: 'read',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_plan_recognition_policies',
})
