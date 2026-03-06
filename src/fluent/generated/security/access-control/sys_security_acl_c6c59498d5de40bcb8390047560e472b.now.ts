import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['c6c59498d5de40bcb8390047560e472b'],
    description: 'Only commission admins can manage deal classification mappings',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_deal_classifications',
})
