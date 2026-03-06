import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['350cd7b34e634f2499dc7d6445834638'],
    description: 'Only commission admins can read governed deal type records',
    type: 'record',
    operation: 'read',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_deal_types',
})
