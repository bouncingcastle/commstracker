import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['ffb154becb23480f9dc04fe84c8e49ff'],
    name: 'Manager Team Governance Validation',
    table: 'x_823178_commissio_manager_team_memberships',
    order: 35,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates manager-team memberships, date windows, and role governance constraints',
    script: Now.include('./sys_script_ffb154becb23480f9dc04fe84c8e49ff.server.js'),
})
