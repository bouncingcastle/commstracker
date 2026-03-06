import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['fc77d54377134dc2aa403da543958d69'],
    description: 'Only commission admins can manage deal classification mappings',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_deal_classifications',
})
