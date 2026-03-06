import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['3d7dfdfde79e4847b2d2534ac977ce0a'],
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
    roles: ['x_823178_commissio.rep', 'x_823178_commissio.admin', 'x_823178_commissio.finance'],
    table: 'x_823178_commissio_bonus_earnings',
})
