import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['b0c5a3dbadb84095908ef524882fcbda'],
    name: 'Statement Approval Workflow Enforcement',
    table: 'x_823178_commissio_statement_approvals',
    order: 60,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Enforces statement approval transitions and syncs statement status',
    script: Now.include('./sys_script_b0c5a3dbadb84095908ef524882fcbda.server.js'),
})
