import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['e51fb173bf6b462885b0f41f0f248e8b'],
    description: 'Only commission admins can create/update manager-team governance rows',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_manager_team_memberships',
})
