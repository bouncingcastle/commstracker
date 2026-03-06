import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['6e4a2593d18d4244b4e9d39c86fd3a2e'],
    description: 'Only commission admins can create/update/deactivate deal type records',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_deal_types',
})
