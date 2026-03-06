import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['bffc59aa2c4e4bc4856c74d48ca39c6e'],
    description: 'Only commission admins can read governed deal type records',
    type: 'record',
    operation: 'read',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_deal_types',
})
