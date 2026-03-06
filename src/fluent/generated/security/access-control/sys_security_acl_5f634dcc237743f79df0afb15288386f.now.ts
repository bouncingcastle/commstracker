import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['5f634dcc237743f79df0afb15288386f'],
    description: 'Only commission admins can read bulk plan assignment run records',
    type: 'record',
    operation: 'read',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_bulk_plan_assignment_runs',
})
