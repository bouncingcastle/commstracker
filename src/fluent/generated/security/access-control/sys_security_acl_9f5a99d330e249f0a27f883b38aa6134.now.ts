import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['9f5a99d330e249f0a27f883b38aa6134'],
    description: 'Only commission admins and finance can read deal classification mappings',
    type: 'record',
    operation: 'read',
    roles: ['x_823178_commissio.admin', 'x_823178_commissio.finance'],
    table: 'x_823178_commissio_deal_classifications',
})
