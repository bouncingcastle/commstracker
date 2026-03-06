import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['0804855e83934cae9428298c696a0479'],
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
    roles: ['x_823178_commissio.admin', 'x_823178_commissio.finance', 'x_823178_commissio.rep'],
    table: 'x_823178_commissio_bonus_earnings',
})
