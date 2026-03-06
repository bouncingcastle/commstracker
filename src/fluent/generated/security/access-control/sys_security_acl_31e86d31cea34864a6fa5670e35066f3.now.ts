import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['31e86d31cea34864a6fa5670e35066f3'],
    description: 'Only commission admins can read governed deal type records',
    type: 'record',
    operation: 'read',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_deal_types',
})
