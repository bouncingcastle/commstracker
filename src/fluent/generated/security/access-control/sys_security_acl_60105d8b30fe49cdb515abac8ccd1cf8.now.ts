import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['60105d8b30fe49cdb515abac8ccd1cf8'],
    description: 'Only commission admins can read governed deal type records',
    type: 'record',
    operation: 'read',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_deal_types',
})
