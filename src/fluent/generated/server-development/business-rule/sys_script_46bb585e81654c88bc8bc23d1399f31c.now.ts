import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['46bb585e81654c88bc8bc23d1399f31c'],
    name: 'Statement Approval Workflow Enforcement',
    table: 'x_823178_commissio_statement_approvals',
    order: 60,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Enforces statement approval transitions and syncs statement status',
    script: Now.include('./sys_script_46bb585e81654c88bc8bc23d1399f31c.server.js'),
})
