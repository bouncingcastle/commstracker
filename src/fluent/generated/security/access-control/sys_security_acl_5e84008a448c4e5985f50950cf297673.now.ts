import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['5e84008a448c4e5985f50950cf297673'],
    description: 'Only commission admins can read governed deal type records',
    type: 'record',
    operation: 'read',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_deal_types',
})
