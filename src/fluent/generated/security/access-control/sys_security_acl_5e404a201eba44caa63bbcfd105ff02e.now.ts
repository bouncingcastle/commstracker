import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['5e404a201eba44caa63bbcfd105ff02e'],
    description: 'Only commission admins can create/update manager-team governance rows',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_manager_team_memberships',
})
