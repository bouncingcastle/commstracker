import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['05c7a98a3f0447fd8f81268291d40465'],
    name: 'Bulk Plan Assignment Run Processor',
    table: 'x_823178_commissio_bulk_plan_assignment_runs',
    order: 40,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Executes bulk plan assignment preview/apply/rollback with overlap checks and rollback support',
    script: Now.include('./sys_script_05c7a98a3f0447fd8f81268291d40465.server.js'),
})
