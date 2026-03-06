import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['b9612aa040644923a15afab32fb8a156'],
    description: 'Only commission admins can read governed deal type records',
    type: 'record',
    operation: 'read',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_deal_types',
})
