import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['ff812eb963b9423eab3d146cbba5e0c7'],
    description: 'Only commission admins can create/update plan target records',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_plan_targets',
})
