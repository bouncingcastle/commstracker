import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['805432a809b545d6b58d50985c000f22'],
    description: 'Only commission admins can create/update/deactivate deal type records',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_deal_types',
})
