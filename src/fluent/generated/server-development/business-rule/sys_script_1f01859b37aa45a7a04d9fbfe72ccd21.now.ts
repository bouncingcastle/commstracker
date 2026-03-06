import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['1f01859b37aa45a7a04d9fbfe72ccd21'],
    name: 'Manager Team Governance Validation',
    table: 'x_823178_commissio_manager_team_memberships',
    order: 35,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates manager-team memberships, date windows, and role governance constraints',
    script: Now.include('./sys_script_1f01859b37aa45a7a04d9fbfe72ccd21.server.js'),
})
