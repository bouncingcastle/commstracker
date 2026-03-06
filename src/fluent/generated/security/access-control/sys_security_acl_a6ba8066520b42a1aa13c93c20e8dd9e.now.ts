import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['a6ba8066520b42a1aa13c93c20e8dd9e'],
    description: 'Only commission admins can create/update/deactivate deal type records',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_deal_types',
})
