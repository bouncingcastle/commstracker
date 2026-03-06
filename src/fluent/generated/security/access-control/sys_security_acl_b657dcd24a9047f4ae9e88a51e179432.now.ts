import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['b657dcd24a9047f4ae9e88a51e179432'],
    description: 'Only commission admins can modify bonus earnings records',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_bonus_earnings',
})
