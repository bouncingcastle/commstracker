import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['1204f5230c9742e2a43464fd6a3362c3'],
    name: 'Bulk Plan Assignment Run Processor',
    table: 'x_823178_commissio_bulk_plan_assignment_runs',
    order: 40,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Executes bulk plan assignment preview/apply/rollback with overlap checks and rollback support',
    script: Now.include('./sys_script_1204f5230c9742e2a43464fd6a3362c3.server.js'),
})
