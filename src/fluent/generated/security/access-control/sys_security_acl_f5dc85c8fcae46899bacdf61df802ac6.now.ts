import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['f5dc85c8fcae46899bacdf61df802ac6'],
    description: 'Only commission admins can read plan tier records',
    type: 'record',
    operation: 'read',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_plan_tiers',
})
