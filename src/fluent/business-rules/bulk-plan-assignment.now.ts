import '@servicenow/sdk/global'
import { BusinessRule } from '@servicenow/sdk/core'
import { processBulkPlanAssignmentRun } from '../../server/business-rules/bulk-plan-assignment.js'

BusinessRule({
    $id: 'bulk_plan_assignment_run_processor',
    name: 'Bulk Plan Assignment Run Processor',
    table: 'x_823178_commissio_bulk_plan_assignment_runs',
    action: ['insert', 'update'],
    when: 'before',
    script: processBulkPlanAssignmentRun,
    active: true,
    order: 40,
    description: 'Executes bulk plan assignment preview/apply/rollback with overlap checks and rollback support'
})
