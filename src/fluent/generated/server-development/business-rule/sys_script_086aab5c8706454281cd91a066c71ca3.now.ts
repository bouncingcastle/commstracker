import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['086aab5c8706454281cd91a066c71ca3'],
    name: 'Bulk Plan Assignment Run Processor',
    table: 'x_823178_commissio_bulk_plan_assignment_runs',
    order: 40,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Executes bulk plan assignment preview/apply/rollback with overlap checks and rollback support',
    script: Now.include('./sys_script_086aab5c8706454281cd91a066c71ca3.server.js'),
})
