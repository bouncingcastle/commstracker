import '@servicenow/sdk/global'
import { BusinessRule } from '@servicenow/sdk/core'
import { validatePlanBonusConfiguration } from '../../server/business-rules/plan-bonus-validation.js'

BusinessRule({
    $id: 'plan_bonus_validation',
    name: 'Plan Bonus Validation',
    table: 'x_823178_commissio_plan_bonuses',
    action: ['insert', 'update'],
    when: 'before',
    script: validatePlanBonusConfiguration,
    active: true,
    order: 42,
    description: 'Validates structured bonus qualification fields and composes a deterministic condition summary'
})
