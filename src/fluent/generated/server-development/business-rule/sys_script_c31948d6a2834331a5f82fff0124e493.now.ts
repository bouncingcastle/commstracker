import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['c31948d6a2834331a5f82fff0124e493'],
    name: 'Statement Approval Workflow Enforcement',
    table: 'x_823178_commissio_statement_approvals',
    order: 60,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Enforces statement approval transitions and syncs statement status',
    script: Now.include('./sys_script_c31948d6a2834331a5f82fff0124e493.server.js'),
})
