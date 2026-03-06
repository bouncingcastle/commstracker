import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['e700e1e847354730bd3f9a82f8d465c3'],
    name: 'Statement Approval Workflow Enforcement',
    table: 'x_823178_commissio_statement_approvals',
    order: 60,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Enforces statement approval transitions and syncs statement status',
    script: Now.include('./sys_script_e700e1e847354730bd3f9a82f8d465c3.server.js'),
})
