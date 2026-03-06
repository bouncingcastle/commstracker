import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['a76cbd19d6cd4e3ea030e338c055a6b7'],
    description: 'Only commission admins can create/update manager-team governance rows',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_manager_team_memberships',
})
