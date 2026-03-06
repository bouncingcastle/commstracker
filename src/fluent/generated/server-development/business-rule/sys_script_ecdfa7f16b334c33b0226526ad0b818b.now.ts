import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['ecdfa7f16b334c33b0226526ad0b818b'],
    name: 'Manager Team Governance Validation',
    table: 'x_823178_commissio_manager_team_memberships',
    order: 35,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates manager-team memberships, date windows, and role governance constraints',
    script: Now.include('./sys_script_ecdfa7f16b334c33b0226526ad0b818b.server.js'),
})
