import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['3d981de2ed1041c2a85c4b7ddd71ed89'],
    description: 'Only commission admins can modify bonus earnings records',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_bonus_earnings',
})
