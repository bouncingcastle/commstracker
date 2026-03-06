import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['f1252cf05f3e486ca45f40cb2009a76a'],
    description: 'Only commission admins can read plan recognition policy records',
    type: 'record',
    operation: 'read',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_plan_recognition_policies',
})
