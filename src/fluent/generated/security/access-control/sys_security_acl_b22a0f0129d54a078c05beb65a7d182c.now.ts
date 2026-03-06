import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['b22a0f0129d54a078c05beb65a7d182c'],
    description: 'Only commission admins can create/update manager-team governance rows',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_manager_team_memberships',
})
