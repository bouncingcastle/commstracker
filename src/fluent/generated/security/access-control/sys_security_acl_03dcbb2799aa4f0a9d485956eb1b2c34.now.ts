import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['03dcbb2799aa4f0a9d485956eb1b2c34'],
    description: 'Only commission admins can create/update/deactivate deal type records',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_deal_types',
})
