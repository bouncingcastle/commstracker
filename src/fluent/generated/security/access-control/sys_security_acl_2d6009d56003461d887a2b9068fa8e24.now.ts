import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['2d6009d56003461d887a2b9068fa8e24'],
    description: 'Only commission admins can read governed deal type records',
    type: 'record',
    operation: 'read',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_deal_types',
})
