import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['dcdfbedd16364e449c0cf73759567a48'],
    name: 'Manager Team Governance Validation',
    table: 'x_823178_commissio_manager_team_memberships',
    order: 35,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates manager-team memberships, date windows, and role governance constraints',
    script: Now.include('./sys_script_dcdfbedd16364e449c0cf73759567a48.server.js'),
})
