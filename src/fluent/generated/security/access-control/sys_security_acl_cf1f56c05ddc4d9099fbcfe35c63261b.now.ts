import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['cf1f56c05ddc4d9099fbcfe35c63261b'],
    description: 'Only commission admins can create/update/deactivate deal type records',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_deal_types',
})
