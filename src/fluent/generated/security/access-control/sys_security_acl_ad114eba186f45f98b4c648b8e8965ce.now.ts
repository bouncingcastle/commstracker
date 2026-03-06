import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['ad114eba186f45f98b4c648b8e8965ce'],
    description: 'Only commission admins can manage deal classification mappings',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_deal_classifications',
})
