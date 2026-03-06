import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['9069ccb0c585466491e0098f8442bcf2'],
    description: 'Only commission admins can create/update manager-team governance rows',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_manager_team_memberships',
})
