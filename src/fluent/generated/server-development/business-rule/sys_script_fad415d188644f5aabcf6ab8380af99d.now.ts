import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['fad415d188644f5aabcf6ab8380af99d'],
    name: 'Statement Approval Workflow Enforcement',
    table: 'x_823178_commissio_statement_approvals',
    order: 60,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Enforces statement approval transitions and syncs statement status',
    script: Now.include('./sys_script_fad415d188644f5aabcf6ab8380af99d.server.js'),
})
