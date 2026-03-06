import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['3a4f4a3a601d4e92ab9a1790b9549803'],
    description: 'Only commission admins can create/update/deactivate deal type records',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_deal_types',
})
