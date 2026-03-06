import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['b78cf83c616f47349145302492a33eff'],
    description: 'Only commission admins can create/update recognition basis policies',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_plan_recognition_policies',
})
