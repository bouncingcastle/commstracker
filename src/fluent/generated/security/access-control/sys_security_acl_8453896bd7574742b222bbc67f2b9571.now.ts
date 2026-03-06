import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['8453896bd7574742b222bbc67f2b9571'],
    description: 'Only commission admins can manage deal classification mappings',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_deal_classifications',
})
