import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['5fbc8668d5f547808f5e42e16ab9ac03'],
    name: 'Bulk Plan Assignment Run Processor',
    table: 'x_823178_commissio_bulk_plan_assignment_runs',
    order: 40,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Executes bulk plan assignment preview/apply/rollback with overlap checks and rollback support',
    script: Now.include('./sys_script_5fbc8668d5f547808f5e42e16ab9ac03.server.js'),
})
