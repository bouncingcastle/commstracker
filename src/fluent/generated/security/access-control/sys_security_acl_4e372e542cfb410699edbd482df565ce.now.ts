import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['4e372e542cfb410699edbd482df565ce'],
    description: 'Only commission admins can create/update/deactivate deal type records',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_deal_types',
})
