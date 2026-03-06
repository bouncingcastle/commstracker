import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['63638372c0824b06ae859e4d30fd3d38'],
    description: 'Only commission admins can read governed deal type records',
    type: 'record',
    operation: 'read',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_deal_types',
})
