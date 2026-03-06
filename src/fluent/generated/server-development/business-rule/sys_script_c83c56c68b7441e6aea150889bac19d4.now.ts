import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['c83c56c68b7441e6aea150889bac19d4'],
    name: 'Statement Approval Workflow Enforcement',
    table: 'x_823178_commissio_statement_approvals',
    order: 60,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Enforces statement approval transitions and syncs statement status',
    script: Now.include('./sys_script_c83c56c68b7441e6aea150889bac19d4.server.js'),
})
