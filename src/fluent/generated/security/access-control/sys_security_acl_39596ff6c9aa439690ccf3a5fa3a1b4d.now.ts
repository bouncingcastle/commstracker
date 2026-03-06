import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['39596ff6c9aa439690ccf3a5fa3a1b4d'],
    description: 'Only commission admins can modify bonus earnings records',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_bonus_earnings',
})
