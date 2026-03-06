import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['2842a63508144ed588cadb9249114b67'],
    name: 'Statement Approval Workflow Enforcement',
    table: 'x_823178_commissio_statement_approvals',
    order: 60,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Enforces statement approval transitions and syncs statement status',
    script: Now.include('./sys_script_2842a63508144ed588cadb9249114b67.server.js'),
})
