import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['5f6a18da044d4064be51563eeef5da19'],
    description: 'Only commission admins and finance can read deal classification mappings',
    type: 'record',
    operation: 'read',
    roles: ['x_823178_commissio.finance', 'x_823178_commissio.admin'],
    table: 'x_823178_commissio_deal_classifications',
})
