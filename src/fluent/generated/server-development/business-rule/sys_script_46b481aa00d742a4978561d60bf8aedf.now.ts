import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['46b481aa00d742a4978561d60bf8aedf'],
    name: 'Bulk Plan Assignment Run Processor',
    table: 'x_823178_commissio_bulk_plan_assignment_runs',
    order: 40,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Executes bulk plan assignment preview/apply/rollback with overlap checks and rollback support',
    script: Now.include('./sys_script_46b481aa00d742a4978561d60bf8aedf.server.js'),
})
