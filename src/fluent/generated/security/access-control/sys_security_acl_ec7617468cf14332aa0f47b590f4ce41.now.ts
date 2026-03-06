import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['ec7617468cf14332aa0f47b590f4ce41'],
    description: 'Only commission admins can create/update/deactivate deal type records',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_deal_types',
})
