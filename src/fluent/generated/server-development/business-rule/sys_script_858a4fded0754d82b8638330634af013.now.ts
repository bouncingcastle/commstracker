import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['858a4fded0754d82b8638330634af013'],
    name: 'Statement Approval Workflow Enforcement',
    table: 'x_823178_commissio_statement_approvals',
    order: 60,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Enforces statement approval transitions and syncs statement status',
    script: Now.include('./sys_script_858a4fded0754d82b8638330634af013.server.js'),
})
