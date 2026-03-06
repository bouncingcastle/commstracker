import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['5338a71cf2c44c62834b7e261194e237'],
    name: 'Statement Approval Workflow Enforcement',
    table: 'x_823178_commissio_statement_approvals',
    order: 60,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Enforces statement approval transitions and syncs statement status',
    script: Now.include('./sys_script_5338a71cf2c44c62834b7e261194e237.server.js'),
})
