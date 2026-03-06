import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['066fd7bb49a44423a1be4579c320db67'],
    name: 'Manager Team Governance Validation',
    table: 'x_823178_commissio_manager_team_memberships',
    order: 35,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates manager-team memberships, date windows, and role governance constraints',
    script: Now.include('./sys_script_066fd7bb49a44423a1be4579c320db67.server.js'),
})
