import '@servicenow/sdk/global'
import { BusinessRule } from '@servicenow/sdk/core'
import {
    validateCommissionPlan,
    preventOverlapAndGaps,
} from '../../server/business-rules/commission-plan-validation.js'

// Business rule to prevent commission plan overlaps and validate data integrity
BusinessRule({
    $id: Now.ID['commission_plan_validation'],
    name: 'Commission Plan Validation',
    table: 'x_823178_commissio_commission_plans',
    action: ['update', 'insert'],
    when: 'before',
    script: validateCommissionPlan,
    active: true,
    order: 25,
    description: 'Validates commission plan data integrity and prevents overlaps',
})

// Business rule to check for overlaps with existing plans
BusinessRule({
    $id: Now.ID['commission_plan_overlap_check'],
    name: 'Commission Plan Overlap Prevention',
    table: 'x_823178_commissio_commission_plans',
    action: ['update', 'insert'],
    when: 'before',
    script: preventOverlapAndGaps,
    active: true,
    order: 30,
    description: 'Prevents overlapping commission plans for the same sales rep',
})
