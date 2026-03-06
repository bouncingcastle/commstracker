import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['994cc770d1a140ed912023bea1d1c8eb'],
    description: 'Only commission admins can manage deal classification mappings',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_deal_classifications',
})
