import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['1804490a7c50472f8519ee608332da50'],
    name: 'Statement Approval Workflow Enforcement',
    table: 'x_823178_commissio_statement_approvals',
    order: 60,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Enforces statement approval transitions and syncs statement status',
    script: Now.include('./sys_script_1804490a7c50472f8519ee608332da50.server.js'),
})
