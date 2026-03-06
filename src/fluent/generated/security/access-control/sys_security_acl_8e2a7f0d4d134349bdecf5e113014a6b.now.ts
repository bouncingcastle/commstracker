import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['8e2a7f0d4d134349bdecf5e113014a6b'],
    description: 'Only commission admins can read plan target records',
    type: 'record',
    operation: 'read',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_plan_targets',
})
