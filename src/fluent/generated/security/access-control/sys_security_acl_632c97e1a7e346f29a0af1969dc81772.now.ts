import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['632c97e1a7e346f29a0af1969dc81772'],
    description: 'Only commission admins and finance can read deal classification mappings',
    type: 'record',
    operation: 'read',
    roles: ['x_823178_commissio.admin', 'x_823178_commissio.finance'],
    table: 'x_823178_commissio_deal_classifications',
})
