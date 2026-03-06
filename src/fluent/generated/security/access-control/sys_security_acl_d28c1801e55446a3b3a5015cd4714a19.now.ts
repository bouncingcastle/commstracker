import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['d28c1801e55446a3b3a5015cd4714a19'],
    description: 'Only commission admins can create/update manager-team governance rows',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_manager_team_memberships',
})
