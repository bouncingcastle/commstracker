import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['36f4c6916e7048849f32ab175907868d'],
    description: 'Only commission admins can create/update/deactivate deal type records',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_deal_types',
})
