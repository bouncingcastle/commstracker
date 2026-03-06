import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['f975feb6e87b4bb99d855d36aa2f39eb'],
    name: 'Bulk Plan Assignment Run Processor',
    table: 'x_823178_commissio_bulk_plan_assignment_runs',
    order: 40,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Executes bulk plan assignment preview/apply/rollback with overlap checks and rollback support',
    script: Now.include('./sys_script_f975feb6e87b4bb99d855d36aa2f39eb.server.js'),
})
