import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['759c74c7b9b74bba93f0d2cbb49b24ba'],
    description: 'Only commission admins can create/update/deactivate deal type records',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_deal_types',
})
