import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['a42e9a042de2418e83be2c23c0a51d4e'],
    name: 'Statement Approval Workflow Enforcement',
    table: 'x_823178_commissio_statement_approvals',
    order: 60,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Enforces statement approval transitions and syncs statement status',
    script: Now.include('./sys_script_a42e9a042de2418e83be2c23c0a51d4e.server.js'),
})
