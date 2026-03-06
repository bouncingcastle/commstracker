import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['16221f33dd11460090beb3645b15ee68'],
    description: 'Only commission admins can read governed deal type records',
    type: 'record',
    operation: 'read',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_deal_types',
})
