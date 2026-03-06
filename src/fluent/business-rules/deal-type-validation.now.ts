import '@servicenow/sdk/global'
import { BusinessRule } from '@servicenow/sdk/core'
import {
    validateDealTypeOnDeal,
    validateDealTypeOnPlanTarget,
    validateDealTypeOnPlanBonus,
    validateDealTypeOnCalculation
} from '../../server/business-rules/deal-type-validation.js'

BusinessRule({
    $id: 'deal_type_validation_deals',
    name: 'Deal Type Validation - Deals',
    table: 'x_823178_commissio_deals',
    action: ['insert', 'update'],
    when: 'before',
    script: validateDealTypeOnDeal,
    active: true,
    order: 45,
    description: 'Ensures deal records use active governed deal types'
})

BusinessRule({
    $id: 'deal_type_validation_plan_targets',
    name: 'Deal Type Validation - Plan Targets',
    table: 'x_823178_commissio_plan_targets',
    action: ['insert', 'update'],
    when: 'before',
    script: validateDealTypeOnPlanTarget,
    active: true,
    order: 45,
    description: 'Ensures plan target records use active governed deal types'
})

BusinessRule({
    $id: 'deal_type_validation_plan_bonuses',
    name: 'Deal Type Validation - Plan Bonuses',
    table: 'x_823178_commissio_plan_bonuses',
    action: ['insert', 'update'],
    when: 'before',
    script: validateDealTypeOnPlanBonus,
    active: true,
    order: 45,
    description: 'Ensures plan bonus records use active governed deal types or supported scope values'
})

BusinessRule({
    $id: 'deal_type_validation_calculations',
    name: 'Deal Type Validation - Calculations',
    table: 'x_823178_commissio_commission_calculations',
    action: ['insert', 'update'],
    when: 'before',
    script: validateDealTypeOnCalculation,
    active: true,
    order: 45,
    description: 'Validates calculation deal type against active governed deal types when value is present'
})
