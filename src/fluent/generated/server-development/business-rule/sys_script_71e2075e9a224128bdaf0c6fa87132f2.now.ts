import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['71e2075e9a224128bdaf0c6fa87132f2'],
    name: 'Bulk Plan Assignment Run Processor',
    table: 'x_823178_commissio_bulk_plan_assignment_runs',
    order: 40,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Executes bulk plan assignment preview/apply/rollback with overlap checks and rollback support',
    script: Now.include('./sys_script_71e2075e9a224128bdaf0c6fa87132f2.server.js'),
})
