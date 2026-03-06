import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['f7ea01fac8d84187906f875f12cdeae0'],
    description: 'Only commission admins can read governed deal type records',
    type: 'record',
    operation: 'read',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_deal_types',
})
