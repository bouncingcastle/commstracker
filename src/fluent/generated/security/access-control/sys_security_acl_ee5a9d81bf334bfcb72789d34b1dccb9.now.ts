import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['ee5a9d81bf334bfcb72789d34b1dccb9'],
    description: 'Only commission admins can create/update manager-team governance rows',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_manager_team_memberships',
})
