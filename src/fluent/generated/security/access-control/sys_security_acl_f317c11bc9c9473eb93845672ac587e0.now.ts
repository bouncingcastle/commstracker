import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['f317c11bc9c9473eb93845672ac587e0'],
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
