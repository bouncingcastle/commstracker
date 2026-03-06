import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['ae25adafa0834064b46064e575e24fd3'],
    description: 'Only commission admins can create/update/deactivate deal type records',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_deal_types',
})
