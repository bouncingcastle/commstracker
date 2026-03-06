import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['7f124d61ee874988890ccb33679d87f6'],
    name: 'Statement Approval Workflow Enforcement',
    table: 'x_823178_commissio_statement_approvals',
    order: 60,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Enforces statement approval transitions and syncs statement status',
    script: Now.include('./sys_script_7f124d61ee874988890ccb33679d87f6.server.js'),
})
