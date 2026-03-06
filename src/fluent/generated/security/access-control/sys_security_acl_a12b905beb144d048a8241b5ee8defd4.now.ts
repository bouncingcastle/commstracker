import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['a12b905beb144d048a8241b5ee8defd4'],
    description: 'Only commission admins can create/update manager-team governance rows',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_manager_team_memberships',
})
