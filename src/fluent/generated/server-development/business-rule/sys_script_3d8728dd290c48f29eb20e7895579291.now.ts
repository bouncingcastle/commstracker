import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['3d8728dd290c48f29eb20e7895579291'],
    name: 'Statement Approval Workflow Enforcement',
    table: 'x_823178_commissio_statement_approvals',
    order: 60,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Enforces statement approval transitions and syncs statement status',
    script: Now.include('./sys_script_3d8728dd290c48f29eb20e7895579291.server.js'),
})
