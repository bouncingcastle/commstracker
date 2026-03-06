import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['563a42bebd3a426f8848d2e47fd47411'],
    description: 'Only commission admins and finance can read deal classification mappings',
    type: 'record',
    operation: 'read',
    roles: ['x_823178_commissio.finance', 'x_823178_commissio.admin'],
    table: 'x_823178_commissio_deal_classifications',
})
