import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['182158f5330d4d8eb2401cf02c4fd77c'],
    description: 'Only commission admins can manage deal classification mappings',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_deal_classifications',
})
