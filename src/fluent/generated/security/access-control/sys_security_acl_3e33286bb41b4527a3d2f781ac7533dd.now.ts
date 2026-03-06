import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['3e33286bb41b4527a3d2f781ac7533dd'],
    description: 'Only commission admins can create/update manager-team governance rows',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_manager_team_memberships',
})
