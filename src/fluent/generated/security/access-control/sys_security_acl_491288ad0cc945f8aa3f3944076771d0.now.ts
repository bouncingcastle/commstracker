import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['491288ad0cc945f8aa3f3944076771d0'],
    description: 'Only commission admins can read governed deal type records',
    type: 'record',
    operation: 'read',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_deal_types',
})
