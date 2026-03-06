import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['ac928e425362484790306ce95e575c73'],
    name: 'Statement Approval Workflow Enforcement',
    table: 'x_823178_commissio_statement_approvals',
    order: 60,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Enforces statement approval transitions and syncs statement status',
    script: Now.include('./sys_script_ac928e425362484790306ce95e575c73.server.js'),
})
