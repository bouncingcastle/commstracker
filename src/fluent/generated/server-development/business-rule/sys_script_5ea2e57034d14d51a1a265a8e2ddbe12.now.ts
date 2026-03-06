import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['5ea2e57034d14d51a1a265a8e2ddbe12'],
    name: 'Manager Team Governance Validation',
    table: 'x_823178_commissio_manager_team_memberships',
    order: 35,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates manager-team memberships, date windows, and role governance constraints',
    script: Now.include('./sys_script_5ea2e57034d14d51a1a265a8e2ddbe12.server.js'),
})
