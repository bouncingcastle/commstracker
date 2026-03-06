import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['bb9c061619894ff69ee76168052121fb'],
    description: 'Only commission admins can read governed deal type records',
    type: 'record',
    operation: 'read',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_deal_types',
})
