import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['d0669c94479e42dc801a9ec093712fb6'],
    name: 'Statement Approval Workflow Enforcement',
    table: 'x_823178_commissio_statement_approvals',
    order: 60,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Enforces statement approval transitions and syncs statement status',
    script: Now.include('./sys_script_d0669c94479e42dc801a9ec093712fb6.server.js'),
})
