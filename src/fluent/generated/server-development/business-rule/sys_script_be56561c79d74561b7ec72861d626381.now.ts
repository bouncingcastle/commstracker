import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['be56561c79d74561b7ec72861d626381'],
    name: 'Statement Approval Workflow Enforcement',
    table: 'x_823178_commissio_statement_approvals',
    order: 60,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Enforces statement approval transitions and syncs statement status',
    script: Now.include('./sys_script_be56561c79d74561b7ec72861d626381.server.js'),
})
