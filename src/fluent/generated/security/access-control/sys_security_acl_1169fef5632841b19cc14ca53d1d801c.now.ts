import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['1169fef5632841b19cc14ca53d1d801c'],
    description: 'Only commission admins can read governed deal type records',
    type: 'record',
    operation: 'read',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_deal_types',
})
