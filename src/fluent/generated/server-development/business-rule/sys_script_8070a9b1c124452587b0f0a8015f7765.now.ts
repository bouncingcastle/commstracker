import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['8070a9b1c124452587b0f0a8015f7765'],
    name: 'Bulk Plan Assignment Run Processor',
    table: 'x_823178_commissio_bulk_plan_assignment_runs',
    order: 40,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Executes bulk plan assignment preview/apply/rollback with overlap checks and rollback support',
    script: Now.include('./sys_script_8070a9b1c124452587b0f0a8015f7765.server.js'),
})
