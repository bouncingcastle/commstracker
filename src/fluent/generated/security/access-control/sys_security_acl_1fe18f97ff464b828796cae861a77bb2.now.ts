import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['1fe18f97ff464b828796cae861a77bb2'],
    description: 'Only commission admins can modify bonus earnings records',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_bonus_earnings',
})
