import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['8ba61567c7b74bdf8a044864899043f8'],
    name: 'Statement Approval Workflow Enforcement',
    table: 'x_823178_commissio_statement_approvals',
    order: 60,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Enforces statement approval transitions and syncs statement status',
    script: Now.include('./sys_script_8ba61567c7b74bdf8a044864899043f8.server.js'),
})
