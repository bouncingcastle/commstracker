import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['54aba2551f584c6cb6d7e719fd43401d'],
    description: 'Only commission admins can create/update manager-team governance rows',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_manager_team_memberships',
})
