import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['5d127d773f914fa19f408404c035d06a'],
    description: 'Only commission admins can create/update/deactivate deal type records',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_deal_types',
})
