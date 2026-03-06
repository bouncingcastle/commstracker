import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['cdd8387c239c4a56af2400760fb58572'],
    description: 'Only commission admins can create/update manager-team governance rows',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_manager_team_memberships',
})
