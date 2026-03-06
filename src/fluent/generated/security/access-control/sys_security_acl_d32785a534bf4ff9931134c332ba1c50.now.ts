import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['d32785a534bf4ff9931134c332ba1c50'],
    description: 'Only commission admins can read governed deal type records',
    type: 'record',
    operation: 'read',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_deal_types',
})
