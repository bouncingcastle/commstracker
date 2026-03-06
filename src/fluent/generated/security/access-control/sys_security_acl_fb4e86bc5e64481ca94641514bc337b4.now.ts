import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['fb4e86bc5e64481ca94641514bc337b4'],
    description: 'Only commission admins can read governed deal type records',
    type: 'record',
    operation: 'read',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_deal_types',
})
