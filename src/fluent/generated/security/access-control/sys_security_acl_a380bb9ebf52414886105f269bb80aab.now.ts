import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['a380bb9ebf52414886105f269bb80aab'],
    description: 'Only commission admins can read plan recognition policy records',
    type: 'record',
    operation: 'read',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_plan_recognition_policies',
})
