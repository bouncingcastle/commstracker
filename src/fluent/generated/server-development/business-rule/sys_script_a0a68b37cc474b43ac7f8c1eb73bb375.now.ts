import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['a0a68b37cc474b43ac7f8c1eb73bb375'],
    name: 'Manager Team Governance Validation',
    table: 'x_823178_commissio_manager_team_memberships',
    order: 35,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates manager-team memberships, date windows, and role governance constraints',
    script: Now.include('./sys_script_a0a68b37cc474b43ac7f8c1eb73bb375.server.js'),
})
