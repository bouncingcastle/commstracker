import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['ea26391b2c2c49b18d6cd69eec977616'],
    description: 'Only commission admins can modify bonus earnings records',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_bonus_earnings',
})
