import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['df06b0a67cd1448aaed8081e4e634be0'],
    description: 'Only commission admins can read governed deal type records',
    type: 'record',
    operation: 'read',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_deal_types',
})
