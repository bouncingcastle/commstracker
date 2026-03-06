import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['f993dcbd91184c049e121d62c73d089e'],
    description: 'Only commission admins can modify bonus earnings records',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_bonus_earnings',
})
