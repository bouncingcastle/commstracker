import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['28d0af3120524589ab77c2bb91dca28a'],
    description: 'Only commission admins can create/update/deactivate deal type records',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_deal_types',
})
