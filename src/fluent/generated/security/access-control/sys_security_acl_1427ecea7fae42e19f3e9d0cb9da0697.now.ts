import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['1427ecea7fae42e19f3e9d0cb9da0697'],
    description: 'Only commission admins and finance can read deal classification mappings',
    type: 'record',
    operation: 'read',
    roles: ['x_823178_commissio.finance', 'x_823178_commissio.admin'],
    table: 'x_823178_commissio_deal_classifications',
})
