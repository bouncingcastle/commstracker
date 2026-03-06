import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['b002d0efc7cf40bb964ffeace5d5cc52'],
    description: 'Only commission admins can create/update/deactivate deal type records',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_deal_types',
})
