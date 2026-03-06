import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['5499f0dbbf004e4fa34ba2bb8a6261bd'],
    description: 'Only commission admins can create/update manager-team governance rows',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_manager_team_memberships',
})
