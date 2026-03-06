import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['23346bcd9cad40489ace3f03e19ce407'],
    description: 'Only commission admins can create/update plan tier records',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_plan_tiers',
})
