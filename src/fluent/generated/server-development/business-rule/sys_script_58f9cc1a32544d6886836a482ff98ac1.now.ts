import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['58f9cc1a32544d6886836a482ff98ac1'],
    name: 'Manager Team Governance Validation',
    table: 'x_823178_commissio_manager_team_memberships',
    order: 35,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates manager-team memberships, date windows, and role governance constraints',
    script: Now.include('./sys_script_58f9cc1a32544d6886836a482ff98ac1.server.js'),
})
