import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['cae21355eb004520bb6d6d339fdfbc1c'],
    description: 'Only commission admins can create/update manager-team governance rows',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_manager_team_memberships',
})
