import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['cc35ed244a6d4e1b84b0b5f20e927c16'],
    description: 'Only commission admins can create/update manager-team governance rows',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_manager_team_memberships',
})
