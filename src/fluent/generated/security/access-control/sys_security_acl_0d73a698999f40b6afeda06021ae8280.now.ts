import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['0d73a698999f40b6afeda06021ae8280'],
    description: 'Admins can read all manager-team governance rows; managers can read their own scope',
    type: 'record',
    operation: 'read',
    script: `
        if (gs.hasRole('x_823178_commissio.manager') && !gs.hasRole('x_823178_commissio.admin')) {
            answer = current.manager_user == gs.getUserID();
        } else {
            answer = true;
        }
    `,
    roles: ['x_823178_commissio.admin', 'x_823178_commissio.manager'],
    table: 'x_823178_commissio_manager_team_memberships',
})
