import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['9c46feb5d8474026a2211d8d0b60f52e'],
    name: 'Statement Approval Workflow Enforcement',
    table: 'x_823178_commissio_statement_approvals',
    order: 60,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Enforces statement approval transitions and syncs statement status',
    script: Now.include('./sys_script_9c46feb5d8474026a2211d8d0b60f52e.server.js'),
})
