import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['d87c62a899174333bc26d3678b646ff6'],
    description: 'Only commission admins can modify bonus earnings records',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_bonus_earnings',
})
