import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['1098d45acd90459d84de0d4dd73ded6f'],
    name: 'Statement Approval Workflow Enforcement',
    table: 'x_823178_commissio_statement_approvals',
    order: 60,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Enforces statement approval transitions and syncs statement status',
    script: Now.include('./sys_script_1098d45acd90459d84de0d4dd73ded6f.server.js'),
})
