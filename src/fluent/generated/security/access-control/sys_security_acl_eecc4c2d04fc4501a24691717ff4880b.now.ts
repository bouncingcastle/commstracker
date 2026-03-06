import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['eecc4c2d04fc4501a24691717ff4880b'],
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
    roles: ['x_823178_commissio.manager', 'x_823178_commissio.admin'],
    table: 'x_823178_commissio_manager_team_memberships',
})
