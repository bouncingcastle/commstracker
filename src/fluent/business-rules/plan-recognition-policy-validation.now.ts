import '@servicenow/sdk/global'
import { BusinessRule } from '@servicenow/sdk/core'
import { validatePlanRecognitionPolicy } from '../../server/business-rules/plan-recognition-policy-validation.js'

BusinessRule({
    $id: 'plan_recognition_policy_validation',
    name: 'Plan Recognition Policy Validation',
    table: 'x_823178_commissio_plan_recognition_policies',
    action: ['insert', 'update'],
    when: 'before',
    script: validatePlanRecognitionPolicy,
    active: true,
    order: 35,
    description: 'Validates recognition basis policy versions, date ranges, and change controls'
})
