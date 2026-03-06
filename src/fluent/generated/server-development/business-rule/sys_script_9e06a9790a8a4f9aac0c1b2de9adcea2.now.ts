import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['9e06a9790a8a4f9aac0c1b2de9adcea2'],
    name: 'Statement Approval Workflow Enforcement',
    table: 'x_823178_commissio_statement_approvals',
    order: 60,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Enforces statement approval transitions and syncs statement status',
    script: Now.include('./sys_script_9e06a9790a8a4f9aac0c1b2de9adcea2.server.js'),
})
