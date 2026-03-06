import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['793e9af133094de5b84c5097dd5992fa'],
    description: 'Only commission admins and finance can read deal classification mappings',
    type: 'record',
    operation: 'read',
    roles: ['x_823178_commissio.admin', 'x_823178_commissio.finance'],
    table: 'x_823178_commissio_deal_classifications',
})
