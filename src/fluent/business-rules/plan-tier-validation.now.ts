import '@servicenow/sdk/global'
import { BusinessRule } from '@servicenow/sdk/core'
import { validatePlanTierConfiguration } from '../../server/business-rules/plan-tier-validation.js'

BusinessRule({
    $id: 'commission_plan_tier_validation',
    name: 'Commission Plan Tier Validation',
    table: 'x_823178_commissio_plan_tiers',
    action: ['insert', 'update'],
    when: 'before',
    script: validatePlanTierConfiguration,
    active: true,
    order: 40,
    description: 'Validates tier scope and range bands to prevent ambiguous or overlapping setup'
})
