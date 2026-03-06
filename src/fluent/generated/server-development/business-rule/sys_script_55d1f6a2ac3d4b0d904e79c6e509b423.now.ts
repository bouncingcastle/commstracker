import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['55d1f6a2ac3d4b0d904e79c6e509b423'],
    name: 'Statement Approval Workflow Enforcement',
    table: 'x_823178_commissio_statement_approvals',
    order: 60,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Enforces statement approval transitions and syncs statement status',
    script: Now.include('./sys_script_55d1f6a2ac3d4b0d904e79c6e509b423.server.js'),
})
