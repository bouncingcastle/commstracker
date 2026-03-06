import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['b53ccc44b6ca41dfac6b66e4e097b900'],
    name: 'Statement Approval Workflow Enforcement',
    table: 'x_823178_commissio_statement_approvals',
    order: 60,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Enforces statement approval transitions and syncs statement status',
    script: Now.include('./sys_script_b53ccc44b6ca41dfac6b66e4e097b900.server.js'),
})
