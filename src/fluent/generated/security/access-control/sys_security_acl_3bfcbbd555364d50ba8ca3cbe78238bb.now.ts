import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['3bfcbbd555364d50ba8ca3cbe78238bb'],
    description: 'Only commission admins can create/update/deactivate deal type records',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_deal_types',
})
