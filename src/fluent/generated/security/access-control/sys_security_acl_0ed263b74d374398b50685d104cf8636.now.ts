import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['0ed263b74d374398b50685d104cf8636'],
    description: 'Only commission admins can read bulk plan assignment run records',
    type: 'record',
    operation: 'read',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_bulk_plan_assignment_runs',
})
