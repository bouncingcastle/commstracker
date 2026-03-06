import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['8f8d91985dd244b58d71fedb6a543fce'],
    name: 'Bulk Plan Assignment Run Processor',
    table: 'x_823178_commissio_bulk_plan_assignment_runs',
    order: 40,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Executes bulk plan assignment preview/apply/rollback with overlap checks and rollback support',
    script: Now.include('./sys_script_8f8d91985dd244b58d71fedb6a543fce.server.js'),
})
