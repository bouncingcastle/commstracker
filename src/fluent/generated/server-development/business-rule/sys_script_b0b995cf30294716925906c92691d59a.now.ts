import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['b0b995cf30294716925906c92691d59a'],
    name: 'Deal Type Validation - Plan Bonuses',
    table: 'x_823178_commissio_plan_bonuses',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Ensures plan bonus records use active governed deal types or supported scope values',
    script: Now.include('./sys_script_b0b995cf30294716925906c92691d59a.server.js'),
})
