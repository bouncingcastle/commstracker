import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['96b18e2c42934990a66688a6b630e3f1'],
    description: 'Only commission admins can read plan tier records',
    type: 'record',
    operation: 'read',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_plan_tiers',
})
