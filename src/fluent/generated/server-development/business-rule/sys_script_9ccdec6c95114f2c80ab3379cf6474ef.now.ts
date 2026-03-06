import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['9ccdec6c95114f2c80ab3379cf6474ef'],
    name: 'Statement Approval Workflow Enforcement',
    table: 'x_823178_commissio_statement_approvals',
    order: 60,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Enforces statement approval transitions and syncs statement status',
    script: Now.include('./sys_script_9ccdec6c95114f2c80ab3379cf6474ef.server.js'),
})
