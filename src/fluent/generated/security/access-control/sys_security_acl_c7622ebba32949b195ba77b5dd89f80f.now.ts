import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['c7622ebba32949b195ba77b5dd89f80f'],
    description: 'Only commission admins can read plan tier records',
    type: 'record',
    operation: 'read',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_plan_tiers',
})
