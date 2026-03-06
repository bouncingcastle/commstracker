import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['5404a7ff428a4721acc609dde27940b3'],
    description: 'Only commission admins can manage deal classification mappings',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_deal_classifications',
})
