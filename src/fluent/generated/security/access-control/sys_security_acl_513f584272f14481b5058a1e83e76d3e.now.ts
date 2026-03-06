import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['513f584272f14481b5058a1e83e76d3e'],
    description: 'Only commission admins can modify bonus earnings records',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_bonus_earnings',
})
