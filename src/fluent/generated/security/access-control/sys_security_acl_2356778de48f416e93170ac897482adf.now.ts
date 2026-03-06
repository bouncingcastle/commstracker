import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['2356778de48f416e93170ac897482adf'],
    description: 'Only commission admins can manage deal classification mappings',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_deal_classifications',
})
