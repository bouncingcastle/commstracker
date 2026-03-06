import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['2e52b775a79a4e60a9b32c7b6fa8001e'],
    description: 'Only commission admins can create/update/deactivate deal type records',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_deal_types',
})
