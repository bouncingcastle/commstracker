import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['ce370ee66150497bbc268e33af1685f6'],
    description: 'Only commission admins can modify bonus earnings records',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_bonus_earnings',
})
