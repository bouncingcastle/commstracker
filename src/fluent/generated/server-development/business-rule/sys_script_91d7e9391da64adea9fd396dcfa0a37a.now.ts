import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['91d7e9391da64adea9fd396dcfa0a37a'],
    name: 'Bulk Plan Assignment Run Processor',
    table: 'x_823178_commissio_bulk_plan_assignment_runs',
    order: 40,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Executes bulk plan assignment preview/apply/rollback with overlap checks and rollback support',
    script: Now.include('./sys_script_91d7e9391da64adea9fd396dcfa0a37a.server.js'),
})
