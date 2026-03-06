import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['df263d67c52340d48e0846a9a4ad85d9'],
    description: 'Only commission admins can execute bulk plan assignment runs',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_bulk_plan_assignment_runs',
})
