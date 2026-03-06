import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['19b72e0940354cb6bda666dae78e37c5'],
    description: 'Only commission admins can create/update manager-team governance rows',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_manager_team_memberships',
})
