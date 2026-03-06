import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['349ab6a4c4ec4337892e84202f1ff82a'],
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
