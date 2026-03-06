import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['77f901a8cf7645cb8d88bcaadfdd191f'],
    name: 'Statement Approval Workflow Enforcement',
    table: 'x_823178_commissio_statement_approvals',
    order: 60,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Enforces statement approval transitions and syncs statement status',
    script: Now.include('./sys_script_77f901a8cf7645cb8d88bcaadfdd191f.server.js'),
})
