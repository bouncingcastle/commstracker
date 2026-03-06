import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['9dce14d84930431e951a056a025a3a9a'],
    description: 'Only commission admins can modify bonus earnings records',
    type: 'record',
    operation: 'write',
    roles: ['x_823178_commissio.admin'],
    table: 'x_823178_commissio_bonus_earnings',
})
