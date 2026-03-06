import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['5ac6b05bb5034e0ab5ad827bf38ce1f7'],
    description: 'Only commission admins can read plan recognition policy records',
    type: 'record',
    operation: 'read',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_plan_recognition_policies',
})
