import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['c8051ebd59b045f894d7c60699882682'],
    description: 'Only commission admins can execute bulk plan assignment runs',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_bulk_plan_assignment_runs',
})
