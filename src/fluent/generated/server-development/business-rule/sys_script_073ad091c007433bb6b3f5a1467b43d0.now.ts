import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['073ad091c007433bb6b3f5a1467b43d0'],
    name: 'Manager Team Governance Validation',
    table: 'x_823178_commissio_manager_team_memberships',
    order: 35,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates manager-team memberships, date windows, and role governance constraints',
    script: Now.include('./sys_script_073ad091c007433bb6b3f5a1467b43d0.server.js'),
})
