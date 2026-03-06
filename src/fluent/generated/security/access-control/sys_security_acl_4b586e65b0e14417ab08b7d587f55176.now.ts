import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['4b586e65b0e14417ab08b7d587f55176'],
    description: 'Only commission admins can read governed deal type records',
    type: 'record',
    operation: 'read',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_deal_types',
})
