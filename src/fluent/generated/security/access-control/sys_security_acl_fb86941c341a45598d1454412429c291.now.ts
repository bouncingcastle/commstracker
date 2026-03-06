import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['fb86941c341a45598d1454412429c291'],
    description: 'Only commission admins can read plan bonus records',
    type: 'record',
    operation: 'read',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_plan_bonuses',
})
