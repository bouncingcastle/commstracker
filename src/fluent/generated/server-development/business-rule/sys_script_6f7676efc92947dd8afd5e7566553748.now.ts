import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['6f7676efc92947dd8afd5e7566553748'],
    name: 'Statement Approval Workflow Enforcement',
    table: 'x_823178_commissio_statement_approvals',
    order: 60,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Enforces statement approval transitions and syncs statement status',
    script: Now.include('./sys_script_6f7676efc92947dd8afd5e7566553748.server.js'),
})
