import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['e7d5e5d494d94f39bdf1f31faee9ef99'],
    name: 'Statement Approval Workflow Enforcement',
    table: 'x_823178_commissio_statement_approvals',
    order: 60,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Enforces statement approval transitions and syncs statement status',
    script: Now.include('./sys_script_e7d5e5d494d94f39bdf1f31faee9ef99.server.js'),
})
