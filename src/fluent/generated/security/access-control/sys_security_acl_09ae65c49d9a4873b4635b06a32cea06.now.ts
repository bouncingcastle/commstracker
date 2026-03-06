import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['09ae65c49d9a4873b4635b06a32cea06'],
    description: 'Only commission admins can create/update plan tier records',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_plan_tiers',
})
