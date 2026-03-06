import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['9d5b6a64286c4da1917fc85a28e4ba8d'],
    description: 'Only commission admins can read governed deal type records',
    type: 'record',
    operation: 'read',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_deal_types',
})
