import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['32b630da12c0422abae8b28168302ed2'],
    description: 'Only commission admins can read plan bonus records',
    type: 'record',
    operation: 'read',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_plan_bonuses',
})
