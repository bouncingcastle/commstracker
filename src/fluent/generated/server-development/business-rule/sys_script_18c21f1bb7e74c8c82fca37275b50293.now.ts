import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['18c21f1bb7e74c8c82fca37275b50293'],
    name: 'Statement Approval Workflow Enforcement',
    table: 'x_823178_commissio_statement_approvals',
    order: 60,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Enforces statement approval transitions and syncs statement status',
    script: Now.include('./sys_script_18c21f1bb7e74c8c82fca37275b50293.server.js'),
})
