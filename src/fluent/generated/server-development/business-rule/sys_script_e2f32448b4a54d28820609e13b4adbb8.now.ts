import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['e2f32448b4a54d28820609e13b4adbb8'],
    name: 'Manager Team Governance Validation',
    table: 'x_823178_commissio_manager_team_memberships',
    order: 35,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates manager-team memberships, date windows, and role governance constraints',
    script: Now.include('./sys_script_e2f32448b4a54d28820609e13b4adbb8.server.js'),
})
