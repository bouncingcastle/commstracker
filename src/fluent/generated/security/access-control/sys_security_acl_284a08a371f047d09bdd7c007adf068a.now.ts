import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['284a08a371f047d09bdd7c007adf068a'],
    description: 'Only commission admins can create/update manager-team governance rows',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_manager_team_memberships',
})
