import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['0d19ab112d1849a0890d452e49cf54f3'],
    name: 'Statement Approval Workflow Enforcement',
    table: 'x_823178_commissio_statement_approvals',
    order: 60,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Enforces statement approval transitions and syncs statement status',
    script: Now.include('./sys_script_0d19ab112d1849a0890d452e49cf54f3.server.js'),
})
