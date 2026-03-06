import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['7e95ed7d46214f1aa1e5af86f86dc798'],
    name: 'Manager Team Governance Validation',
    table: 'x_823178_commissio_manager_team_memberships',
    order: 35,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates manager-team memberships, date windows, and role governance constraints',
    script: Now.include('./sys_script_7e95ed7d46214f1aa1e5af86f86dc798.server.js'),
})
