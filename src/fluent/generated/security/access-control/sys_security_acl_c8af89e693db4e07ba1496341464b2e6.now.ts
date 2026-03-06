import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['c8af89e693db4e07ba1496341464b2e6'],
    description: 'Only commission admins can create/update/deactivate deal type records',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_deal_types',
})
