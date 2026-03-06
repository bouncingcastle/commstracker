import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['7789e16398424c79a93efad67f7887c5'],
    description: 'Only commission admins can read governed deal type records',
    type: 'record',
    operation: 'read',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_deal_types',
})
