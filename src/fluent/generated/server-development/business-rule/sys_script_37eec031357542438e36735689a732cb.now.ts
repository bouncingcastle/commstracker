import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['37eec031357542438e36735689a732cb'],
    name: 'Statement Approval Workflow Enforcement',
    table: 'x_823178_commissio_statement_approvals',
    order: 60,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Enforces statement approval transitions and syncs statement status',
    script: Now.include('./sys_script_37eec031357542438e36735689a732cb.server.js'),
})
