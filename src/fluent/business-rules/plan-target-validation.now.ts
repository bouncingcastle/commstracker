import '@servicenow/sdk/global'
import { BusinessRule } from '@servicenow/sdk/core'
import { validatePlanTargetConfiguration } from '../../server/business-rules/plan-target-validation.js'

BusinessRule({
    $id: 'plan_target_validation',
    name: 'Plan Target Validation',
    table: 'x_823178_commissio_plan_targets',
    action: ['update', 'insert'],
    when: 'before',
    script: validatePlanTargetConfiguration,
    active: true,
    order: 38,
    description: 'Validates plan target referential integrity and prevents duplicate active targets per plan/deal type',
})
