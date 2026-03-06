import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['25069cd22e294dcb973b563a8e7b3e77'],
    description: 'Only commission admins can modify bonus earnings records',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_bonus_earnings',
})
