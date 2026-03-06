import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['6ccf16b8556a4c22a9d4fce942049176'],
    description: 'Only commission admins can create/update manager-team governance rows',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_manager_team_memberships',
})
