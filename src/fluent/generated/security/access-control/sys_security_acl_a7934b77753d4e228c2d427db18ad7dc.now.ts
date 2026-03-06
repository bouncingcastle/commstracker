import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['a7934b77753d4e228c2d427db18ad7dc'],
    description: 'Only commission admins can read plan bonus records',
    type: 'record',
    operation: 'read',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_plan_bonuses',
})
