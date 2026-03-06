import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['1249961d0e7442f4a3f0ba618a777c99'],
    description: 'Only commission admins can modify bonus earnings records',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_bonus_earnings',
})
