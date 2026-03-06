import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['c53b17273dfa495d8e7e2e2bdc0a5ea3'],
    description: 'Only commission admins can read bulk plan assignment run records',
    type: 'record',
    operation: 'read',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_bulk_plan_assignment_runs',
})
