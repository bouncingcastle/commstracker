import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['37b8970077f44a8492594a92cc2404c1'],
    description: 'Only commission admins can read governed deal type records',
    type: 'record',
    operation: 'read',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_deal_types',
})
