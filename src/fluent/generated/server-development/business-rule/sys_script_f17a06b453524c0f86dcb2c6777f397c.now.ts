import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['f17a06b453524c0f86dcb2c6777f397c'],
    name: 'Statement Approval Workflow Enforcement',
    table: 'x_823178_commissio_statement_approvals',
    order: 60,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Enforces statement approval transitions and syncs statement status',
    script: Now.include('./sys_script_f17a06b453524c0f86dcb2c6777f397c.server.js'),
})
