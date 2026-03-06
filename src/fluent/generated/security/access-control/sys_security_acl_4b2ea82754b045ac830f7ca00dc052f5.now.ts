import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['4b2ea82754b045ac830f7ca00dc052f5'],
    description: 'Only commission admins can read plan recognition policy records',
    type: 'record',
    operation: 'read',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_plan_recognition_policies',
})
