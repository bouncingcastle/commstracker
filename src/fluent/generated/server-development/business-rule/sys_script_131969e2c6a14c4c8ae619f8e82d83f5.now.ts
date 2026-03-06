import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['131969e2c6a14c4c8ae619f8e82d83f5'],
    name: 'Manager Team Governance Validation',
    table: 'x_823178_commissio_manager_team_memberships',
    order: 35,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates manager-team memberships, date windows, and role governance constraints',
    script: Now.include('./sys_script_131969e2c6a14c4c8ae619f8e82d83f5.server.js'),
})
