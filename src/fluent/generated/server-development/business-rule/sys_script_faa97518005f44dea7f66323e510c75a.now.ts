import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['faa97518005f44dea7f66323e510c75a'],
    name: 'Manager Team Governance Validation',
    table: 'x_823178_commissio_manager_team_memberships',
    order: 35,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates manager-team memberships, date windows, and role governance constraints',
    script: Now.include('./sys_script_faa97518005f44dea7f66323e510c75a.server.js'),
})
