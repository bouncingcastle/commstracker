import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['29a863ad0a6f4b259b6b3053480d634e'],
    description: 'Only commission admins can manage deal classification mappings',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_deal_classifications',
})
