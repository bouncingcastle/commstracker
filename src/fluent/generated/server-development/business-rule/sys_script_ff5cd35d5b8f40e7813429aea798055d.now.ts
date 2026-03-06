import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['ff5cd35d5b8f40e7813429aea798055d'],
    name: 'Statement Approval Workflow Enforcement',
    table: 'x_823178_commissio_statement_approvals',
    order: 60,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Enforces statement approval transitions and syncs statement status',
    script: Now.include('./sys_script_ff5cd35d5b8f40e7813429aea798055d.server.js'),
})
