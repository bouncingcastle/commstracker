import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['9effc2d0984d4d7ba8177b84b41030e8'],
    description: 'Reps can read their own bonus earnings; admins and finance can read all',
    type: 'record',
    operation: 'read',
    script: `
        if (gs.hasRole('x_823178_commissio.rep') && !gs.hasRole('x_823178_commissio.admin') && !gs.hasRole('x_823178_commissio.finance')) {
            answer = current.sales_rep == gs.getUserID();
        } else {
            answer = true;
        }
    `,
    roles: ['x_823178_commissio.rep', 'x_823178_commissio.finance', 'x_823178_commissio.admin'],
    table: 'x_823178_commissio_bonus_earnings',
})
