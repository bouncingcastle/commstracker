import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['25246dbf3eae469092d70169a19a328f'],
    description: 'Only commission admins can execute bulk plan assignment runs',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_bulk_plan_assignment_runs',
})
