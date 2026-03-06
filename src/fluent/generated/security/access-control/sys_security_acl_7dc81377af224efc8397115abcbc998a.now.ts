import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['7dc81377af224efc8397115abcbc998a'],
    description: 'Only commission admins and finance can read deal classification mappings',
    type: 'record',
    operation: 'read',
    roles: ['x_823178_commissio.admin', 'x_823178_commissio.finance'],
    table: 'x_823178_commissio_deal_classifications',
})
