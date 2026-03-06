import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['fb13faf8c2dd406b8ef2c54d55fc92da'],
    description: 'Only commission admins can modify bonus earnings records',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_bonus_earnings',
})
