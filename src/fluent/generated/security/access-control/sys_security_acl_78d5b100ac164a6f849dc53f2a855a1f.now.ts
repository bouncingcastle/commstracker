import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['78d5b100ac164a6f849dc53f2a855a1f'],
    description: 'Only commission admins can create/update manager-team governance rows',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_manager_team_memberships',
})
