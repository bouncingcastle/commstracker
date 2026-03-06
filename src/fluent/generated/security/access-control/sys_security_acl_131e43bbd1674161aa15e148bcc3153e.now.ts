import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['131e43bbd1674161aa15e148bcc3153e'],
    description: 'Only commission admins can modify bonus earnings records',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_bonus_earnings',
})
