import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['c317c4ede347452484c10610907f57f4'],
    description: 'Only commission admins can read governed deal type records',
    type: 'record',
    operation: 'read',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_deal_types',
})
