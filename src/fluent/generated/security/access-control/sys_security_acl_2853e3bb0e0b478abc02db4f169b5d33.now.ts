import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['2853e3bb0e0b478abc02db4f169b5d33'],
    description: 'Only commission admins can create/update/deactivate deal type records',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_deal_types',
})
