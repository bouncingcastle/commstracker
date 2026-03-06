import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['cf7e77b09fd449e7bc7b289753409929'],
    name: 'Bulk Plan Assignment Run Processor',
    table: 'x_823178_commissio_bulk_plan_assignment_runs',
    order: 40,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Executes bulk plan assignment preview/apply/rollback with overlap checks and rollback support',
    script: Now.include('./sys_script_cf7e77b09fd449e7bc7b289753409929.server.js'),
})
