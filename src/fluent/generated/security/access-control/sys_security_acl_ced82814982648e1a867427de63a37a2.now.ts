import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['ced82814982648e1a867427de63a37a2'],
    description: 'Only commission admins can create/update/deactivate deal type records',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_deal_types',
})
