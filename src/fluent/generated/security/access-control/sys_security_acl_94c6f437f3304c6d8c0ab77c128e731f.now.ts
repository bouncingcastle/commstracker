import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['94c6f437f3304c6d8c0ab77c128e731f'],
    description: 'Only commission admins and finance can read deal classification mappings',
    type: 'record',
    operation: 'read',
    roles: ['x_823178_commissio.admin', 'x_823178_commissio.finance'],
    table: 'x_823178_commissio_deal_classifications',
})
