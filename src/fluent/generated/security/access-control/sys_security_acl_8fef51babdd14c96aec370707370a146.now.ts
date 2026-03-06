import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['8fef51babdd14c96aec370707370a146'],
    description: 'Only commission admins can read bulk plan assignment run records',
    type: 'record',
    operation: 'read',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_bulk_plan_assignment_runs',
})
