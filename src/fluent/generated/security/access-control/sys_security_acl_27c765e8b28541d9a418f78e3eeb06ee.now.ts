import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['27c765e8b28541d9a418f78e3eeb06ee'],
    description: 'Only commission admins can create/update manager-team governance rows',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_manager_team_memberships',
})
