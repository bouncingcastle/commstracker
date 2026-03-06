import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['2e04fe9940ee45e88dc49971506ad20a'],
    description: 'Only commission admins can modify bonus earnings records',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_bonus_earnings',
})
