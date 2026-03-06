import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['8a6f5c643dcb4043bc8a60ea673e57fb'],
    description: 'Only commission admins can create/update recognition basis policies',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_plan_recognition_policies',
})
