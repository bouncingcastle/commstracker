import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['c0ce61089ef74d61808153a9b7f86c44'],
    description: 'Only commission admins can modify bonus earnings records',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_bonus_earnings',
})
