import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['f74817f33e374040a98ff066a2ddab54'],
    description: 'Only commission admins can read governed deal type records',
    type: 'record',
    operation: 'read',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_deal_types',
})
