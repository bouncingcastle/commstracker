import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['6f70b0ee21de47e8a48f8940bd10e4f9'],
    description: 'Only commission admins can create/update plan target records',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_plan_targets',
})
