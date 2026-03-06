import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['9815b40633e84c2dbdfa24a3b37411c0'],
    description: 'Only commission admins can read governed deal type records',
    type: 'record',
    operation: 'read',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_deal_types',
})
