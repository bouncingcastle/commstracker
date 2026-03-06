import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['67d9d9ea01a548a4bf0b1aa5f2db5e72'],
    name: 'Manager Team Governance Validation',
    table: 'x_823178_commissio_manager_team_memberships',
    order: 35,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates manager-team memberships, date windows, and role governance constraints',
    script: Now.include('./sys_script_67d9d9ea01a548a4bf0b1aa5f2db5e72.server.js'),
})
