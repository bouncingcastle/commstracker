import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['9ff870ec3c044e63a194de0ee9f36251'],
    name: 'Manager Team Governance Validation',
    table: 'x_823178_commissio_manager_team_memberships',
    order: 35,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates manager-team memberships, date windows, and role governance constraints',
    script: Now.include('./sys_script_9ff870ec3c044e63a194de0ee9f36251.server.js'),
})
