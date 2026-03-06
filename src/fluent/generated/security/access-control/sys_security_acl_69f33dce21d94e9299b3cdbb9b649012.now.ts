import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['69f33dce21d94e9299b3cdbb9b649012'],
    description: 'Only commission admins can read bulk plan assignment run records',
    type: 'record',
    operation: 'read',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_bulk_plan_assignment_runs',
})
