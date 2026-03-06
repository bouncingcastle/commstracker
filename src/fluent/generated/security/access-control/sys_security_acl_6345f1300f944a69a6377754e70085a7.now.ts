import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['6345f1300f944a69a6377754e70085a7'],
    description: 'Only commission admins can read plan recognition policy records',
    type: 'record',
    operation: 'read',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_plan_recognition_policies',
})
