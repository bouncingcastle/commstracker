import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['46363c5167034c109d178f900c80b253'],
    name: 'Statement Approval Workflow Enforcement',
    table: 'x_823178_commissio_statement_approvals',
    order: 60,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Enforces statement approval transitions and syncs statement status',
    script: Now.include('./sys_script_46363c5167034c109d178f900c80b253.server.js'),
})
