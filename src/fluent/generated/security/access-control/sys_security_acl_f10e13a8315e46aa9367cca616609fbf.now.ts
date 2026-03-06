import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['f10e13a8315e46aa9367cca616609fbf'],
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
    roles: ['x_823178_commissio.finance', 'x_823178_commissio.admin', 'x_823178_commissio.rep'],
    table: 'x_823178_commissio_bonus_earnings',
})
