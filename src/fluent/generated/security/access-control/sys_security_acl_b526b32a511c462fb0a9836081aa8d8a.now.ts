import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['b526b32a511c462fb0a9836081aa8d8a'],
    description: 'Only commission admins and finance can read deal classification mappings',
    type: 'record',
    operation: 'read',
    roles: ['x_823178_commissio.finance', 'x_823178_commissio.admin'],
    table: 'x_823178_commissio_deal_classifications',
})
