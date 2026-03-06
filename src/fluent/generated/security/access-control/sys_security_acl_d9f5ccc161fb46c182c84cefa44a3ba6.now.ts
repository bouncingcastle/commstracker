import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['d9f5ccc161fb46c182c84cefa44a3ba6'],
    description: 'Only commission admins can create/update/deactivate deal type records',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_deal_types',
})
