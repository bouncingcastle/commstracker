import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['6bacd2a0d2e44a82b7b375c3a77e6ec9'],
    description: 'Only commission admins can manage deal classification mappings',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_deal_classifications',
})
