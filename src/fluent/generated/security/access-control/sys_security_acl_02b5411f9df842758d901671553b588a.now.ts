import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['02b5411f9df842758d901671553b588a'],
    description: 'Only commission admins can modify bonus earnings records',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_bonus_earnings',
})
