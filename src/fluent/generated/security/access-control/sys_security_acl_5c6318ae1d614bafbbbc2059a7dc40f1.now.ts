import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['5c6318ae1d614bafbbbc2059a7dc40f1'],
    description: 'Only commission admins can read governed deal type records',
    type: 'record',
    operation: 'read',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_deal_types',
})
