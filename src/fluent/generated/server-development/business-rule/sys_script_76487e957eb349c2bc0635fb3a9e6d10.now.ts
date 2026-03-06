import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['76487e957eb349c2bc0635fb3a9e6d10'],
    name: 'Manager Team Governance Validation',
    table: 'x_823178_commissio_manager_team_memberships',
    order: 35,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates manager-team memberships, date windows, and role governance constraints',
    script: Now.include('./sys_script_76487e957eb349c2bc0635fb3a9e6d10.server.js'),
})
