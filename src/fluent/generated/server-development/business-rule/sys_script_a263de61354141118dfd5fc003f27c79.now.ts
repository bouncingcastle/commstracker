import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['a263de61354141118dfd5fc003f27c79'],
    name: 'Bulk Plan Assignment Run Processor',
    table: 'x_823178_commissio_bulk_plan_assignment_runs',
    order: 40,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Executes bulk plan assignment preview/apply/rollback with overlap checks and rollback support',
    script: Now.include('./sys_script_a263de61354141118dfd5fc003f27c79.server.js'),
})
