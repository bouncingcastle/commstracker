import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['1b411f3131e0476195793c30d263a56e'],
    name: 'Manager Team Governance Validation',
    table: 'x_823178_commissio_manager_team_memberships',
    order: 35,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates manager-team memberships, date windows, and role governance constraints',
    script: Now.include('./sys_script_1b411f3131e0476195793c30d263a56e.server.js'),
})
