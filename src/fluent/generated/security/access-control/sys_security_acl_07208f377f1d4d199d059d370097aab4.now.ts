import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['07208f377f1d4d199d059d370097aab4'],
    description: 'Only commission admins can execute bulk plan assignment runs',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_bulk_plan_assignment_runs',
})
