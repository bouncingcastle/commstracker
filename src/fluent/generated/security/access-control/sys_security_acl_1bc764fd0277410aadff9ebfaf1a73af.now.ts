import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['1bc764fd0277410aadff9ebfaf1a73af'],
    description: 'Only commission admins can read plan target records',
    type: 'record',
    operation: 'read',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_plan_targets',
})
