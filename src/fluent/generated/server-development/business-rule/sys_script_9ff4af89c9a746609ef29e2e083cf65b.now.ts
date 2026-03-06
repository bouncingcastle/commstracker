import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['9ff4af89c9a746609ef29e2e083cf65b'],
    name: 'Bulk Plan Assignment Run Processor',
    table: 'x_823178_commissio_bulk_plan_assignment_runs',
    order: 40,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Executes bulk plan assignment preview/apply/rollback with overlap checks and rollback support',
    script: Now.include('./sys_script_9ff4af89c9a746609ef29e2e083cf65b.server.js'),
})
