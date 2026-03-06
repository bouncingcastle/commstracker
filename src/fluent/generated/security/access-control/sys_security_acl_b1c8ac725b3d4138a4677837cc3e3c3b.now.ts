import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['b1c8ac725b3d4138a4677837cc3e3c3b'],
    description: 'Only commission admins can modify bonus earnings records',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_bonus_earnings',
})
