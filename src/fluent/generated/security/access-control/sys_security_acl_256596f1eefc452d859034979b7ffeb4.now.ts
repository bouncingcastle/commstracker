import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['256596f1eefc452d859034979b7ffeb4'],
    description: 'Only commission admins can create/update plan tier records',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_plan_tiers',
})
