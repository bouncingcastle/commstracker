import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['9991875462ae41aa9ba0ee676c8bb330'],
    description: 'Only commission admins can read bulk plan assignment run records',
    type: 'record',
    operation: 'read',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_bulk_plan_assignment_runs',
})
