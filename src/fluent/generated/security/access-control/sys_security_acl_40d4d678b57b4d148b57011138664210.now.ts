import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['40d4d678b57b4d148b57011138664210'],
    description: 'Only commission admins and finance can read deal classification mappings',
    type: 'record',
    operation: 'read',
    roles: ['x_823178_commissio.finance', 'x_823178_commissio.admin'],
    table: 'x_823178_commissio_deal_classifications',
})
