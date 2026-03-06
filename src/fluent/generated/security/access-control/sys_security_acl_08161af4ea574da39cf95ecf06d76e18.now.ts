import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['08161af4ea574da39cf95ecf06d76e18'],
    description: 'Only commission admins can modify bonus earnings records',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_bonus_earnings',
})
