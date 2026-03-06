import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['888f0adaf09842ed856c87f039020a8b'],
    description: 'Only commission admins can execute bulk plan assignment runs',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_bulk_plan_assignment_runs',
})
