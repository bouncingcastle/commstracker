import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['9af766f02b064b7a8cdfbd4af55c4a62'],
    description: 'Only commission admins and finance can read deal classification mappings',
    type: 'record',
    operation: 'read',
    roles: ['x_823178_commissio.admin', 'x_823178_commissio.finance'],
    table: 'x_823178_commissio_deal_classifications',
})
