import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['46695ea2d4004f9b96d23346a2cb53d0'],
    description: 'Only commission admins and finance can read deal classification mappings',
    type: 'record',
    operation: 'read',
    roles: ['x_823178_commissio.finance', 'x_823178_commissio.admin'],
    table: 'x_823178_commissio_deal_classifications',
})
