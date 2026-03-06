import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['c140b66c5b294ec9b5dcfd3a168042bd'],
    description: 'Only commission admins can modify bonus earnings records',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_bonus_earnings',
})
