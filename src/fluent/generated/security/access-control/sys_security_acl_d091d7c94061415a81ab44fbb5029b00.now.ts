import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['d091d7c94061415a81ab44fbb5029b00'],
    description: 'Only commission admins can create/update recognition basis policies',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_plan_recognition_policies',
})
