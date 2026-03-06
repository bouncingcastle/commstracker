import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['292899068ca847efa660295aa2986a75'],
    description: 'Only commission admins can create/update/deactivate deal type records',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_deal_types',
})
