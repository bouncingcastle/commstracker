import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['513aca6679b84cdbb09a9f405b77cfbe'],
    description: 'Only commission admins can create/update manager-team governance rows',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_manager_team_memberships',
})
