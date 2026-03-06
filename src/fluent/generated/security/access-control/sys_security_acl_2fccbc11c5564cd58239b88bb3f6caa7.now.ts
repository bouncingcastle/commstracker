import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['2fccbc11c5564cd58239b88bb3f6caa7'],
    description: 'Only commission admins can manage deal classification mappings',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_deal_classifications',
})
