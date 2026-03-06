import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['cfdae114e6924a6fb28a3ab21703b662'],
    description: 'Only commission admins can read plan bonus records',
    type: 'record',
    operation: 'read',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_plan_bonuses',
})
