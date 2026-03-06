import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['00a02832f36e4fa1973bc24a4da99c65'],
    name: 'Manager Team Governance Validation',
    table: 'x_823178_commissio_manager_team_memberships',
    order: 35,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates manager-team memberships, date windows, and role governance constraints',
    script: Now.include('./sys_script_00a02832f36e4fa1973bc24a4da99c65.server.js'),
})
