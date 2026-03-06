import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['c2304897a3e4404baf6c53f94b7346db'],
    description: 'Only commission admins can read plan tier records',
    type: 'record',
    operation: 'read',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_plan_tiers',
})
