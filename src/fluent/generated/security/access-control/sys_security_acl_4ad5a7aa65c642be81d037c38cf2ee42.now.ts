import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['4ad5a7aa65c642be81d037c38cf2ee42'],
    description: 'Only commission admins can read plan bonus records',
    type: 'record',
    operation: 'read',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_plan_bonuses',
})
