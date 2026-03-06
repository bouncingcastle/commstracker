import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['1b3aaa3ec4d344f49125b58b8e1892a6'],
    description: 'Only commission admins can create/update/deactivate deal type records',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_deal_types',
})
