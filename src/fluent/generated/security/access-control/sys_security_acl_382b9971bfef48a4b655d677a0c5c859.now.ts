import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['382b9971bfef48a4b655d677a0c5c859'],
    description: 'Only commission admins can create/update manager-team governance rows',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_manager_team_memberships',
})
