import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['5671114af4ce4d65a6097db7d89edc40'],
    name: 'Bulk Plan Assignment Run Processor',
    table: 'x_823178_commissio_bulk_plan_assignment_runs',
    order: 40,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Executes bulk plan assignment preview/apply/rollback with overlap checks and rollback support',
    script: Now.include('./sys_script_5671114af4ce4d65a6097db7d89edc40.server.js'),
})
