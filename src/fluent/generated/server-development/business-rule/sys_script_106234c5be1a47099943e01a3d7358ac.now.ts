import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['106234c5be1a47099943e01a3d7358ac'],
    name: 'Manager Team Governance Validation',
    table: 'x_823178_commissio_manager_team_memberships',
    order: 35,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates manager-team memberships, date windows, and role governance constraints',
    script: Now.include('./sys_script_106234c5be1a47099943e01a3d7358ac.server.js'),
})
