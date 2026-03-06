import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['59efdd96aecb4de3b3d89276626d31e6'],
    name: 'Statement Approval Workflow Enforcement',
    table: 'x_823178_commissio_statement_approvals',
    order: 60,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Enforces statement approval transitions and syncs statement status',
    script: Now.include('./sys_script_59efdd96aecb4de3b3d89276626d31e6.server.js'),
})
