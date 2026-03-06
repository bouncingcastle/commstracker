import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['fd7b048dbaea46138216965e5fedc8f4'],
    name: 'Statement Approval Workflow Enforcement',
    table: 'x_823178_commissio_statement_approvals',
    order: 60,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Enforces statement approval transitions and syncs statement status',
    script: Now.include('./sys_script_fd7b048dbaea46138216965e5fedc8f4.server.js'),
})
