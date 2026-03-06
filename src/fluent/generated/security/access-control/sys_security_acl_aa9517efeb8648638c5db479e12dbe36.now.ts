import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['aa9517efeb8648638c5db479e12dbe36'],
    description: 'Only commission admins can modify bonus earnings records',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_bonus_earnings',
})
