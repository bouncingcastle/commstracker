import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['b792045d889a4219bd3f4aedc19449b5'],
    description: 'Only commission admins can read governed deal type records',
    type: 'record',
    operation: 'read',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_deal_types',
})
