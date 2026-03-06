import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['235ae5361c654d2db180c9b98d76e373'],
    description: 'Only commission admins can create/update/deactivate deal type records',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_deal_types',
})
