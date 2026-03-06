import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['bb9a6eb4e4fe4af282327a3658fe1473'],
    description: 'Only commission admins can create/update/deactivate deal type records',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_deal_types',
})
