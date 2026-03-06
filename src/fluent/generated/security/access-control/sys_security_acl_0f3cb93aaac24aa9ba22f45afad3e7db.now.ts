import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['0f3cb93aaac24aa9ba22f45afad3e7db'],
    description: 'Only commission admins can read bulk plan assignment run records',
    type: 'record',
    operation: 'read',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_bulk_plan_assignment_runs',
})
