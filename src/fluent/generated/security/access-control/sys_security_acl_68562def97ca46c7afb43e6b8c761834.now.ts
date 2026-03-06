import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['68562def97ca46c7afb43e6b8c761834'],
    description: 'Only commission admins can create/update manager-team governance rows',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_manager_team_memberships',
})
