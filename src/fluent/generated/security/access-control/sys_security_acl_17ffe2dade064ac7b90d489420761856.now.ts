import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['17ffe2dade064ac7b90d489420761856'],
    description: 'Only commission admins can create/update/deactivate deal type records',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_deal_types',
})
