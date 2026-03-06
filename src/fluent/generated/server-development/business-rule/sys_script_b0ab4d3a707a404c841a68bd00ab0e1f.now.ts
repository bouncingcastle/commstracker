import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['b0ab4d3a707a404c841a68bd00ab0e1f'],
    name: 'Bulk Plan Assignment Run Processor',
    table: 'x_823178_commissio_bulk_plan_assignment_runs',
    order: 40,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Executes bulk plan assignment preview/apply/rollback with overlap checks and rollback support',
    script: Now.include('./sys_script_b0ab4d3a707a404c841a68bd00ab0e1f.server.js'),
})
