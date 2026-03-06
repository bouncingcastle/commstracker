import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['2b2d62fd48544b1a89c43f997fc1b0a4'],
    name: 'Bulk Plan Assignment Run Processor',
    table: 'x_823178_commissio_bulk_plan_assignment_runs',
    order: 40,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Executes bulk plan assignment preview/apply/rollback with overlap checks and rollback support',
    script: Now.include('./sys_script_2b2d62fd48544b1a89c43f997fc1b0a4.server.js'),
})
