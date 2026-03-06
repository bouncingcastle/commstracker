import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['aa6445b511264bb696b93dbde3de92a0'],
    description: 'Only commission admins can create/update plan bonus records',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_plan_bonuses',
})
