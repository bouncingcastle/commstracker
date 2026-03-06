import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['5c13bea93ce44410a48bc48f8d5a5802'],
    name: 'Manager Team Governance Validation',
    table: 'x_823178_commissio_manager_team_memberships',
    order: 35,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates manager-team memberships, date windows, and role governance constraints',
    script: Now.include('./sys_script_5c13bea93ce44410a48bc48f8d5a5802.server.js'),
})
