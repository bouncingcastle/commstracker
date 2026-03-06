import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['5327eaaef98d4e649040d6d9e4cf1a4a'],
    name: 'Manager Team Governance Validation',
    table: 'x_823178_commissio_manager_team_memberships',
    order: 35,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates manager-team memberships, date windows, and role governance constraints',
    script: Now.include('./sys_script_5327eaaef98d4e649040d6d9e4cf1a4a.server.js'),
})
