import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['93a8a7daf84e4734a13dd474259aab97'],
    description: 'Only commission admins can manage deal classification mappings',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_deal_classifications',
})
