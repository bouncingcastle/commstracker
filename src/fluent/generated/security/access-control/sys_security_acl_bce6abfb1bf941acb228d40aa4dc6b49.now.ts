import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['bce6abfb1bf941acb228d40aa4dc6b49'],
    description: 'Only commission admins can create/update/deactivate deal type records',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_deal_types',
})
