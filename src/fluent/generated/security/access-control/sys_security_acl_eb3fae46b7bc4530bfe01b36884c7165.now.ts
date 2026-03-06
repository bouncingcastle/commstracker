import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['eb3fae46b7bc4530bfe01b36884c7165'],
    description: 'Only commission admins can read governed deal type records',
    type: 'record',
    operation: 'read',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_deal_types',
})
