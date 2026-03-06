import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['2b9af1bdc0214df2a451c75368cc0685'],
    description: 'Only commission admins can read governed deal type records',
    type: 'record',
    operation: 'read',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_deal_types',
})
