import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['d4e470f5aebd4e41ae3520223b646ffa'],
    description: 'Only commission admins can read plan recognition policy records',
    type: 'record',
    operation: 'read',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_plan_recognition_policies',
})
