import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['ab63b80f61464c5db182e186adbaa0b0'],
    name: 'Manager Team Governance Validation',
    table: 'x_823178_commissio_manager_team_memberships',
    order: 35,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates manager-team memberships, date windows, and role governance constraints',
    script: Now.include('./sys_script_ab63b80f61464c5db182e186adbaa0b0.server.js'),
})
