import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['b263f1d01dea4f98903af0f0c9ecde20'],
    name: 'Deal Type Validation - Plan Bonuses',
    table: 'x_823178_commissio_plan_bonuses',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Ensures plan bonus records use active governed deal types or supported scope values',
    script: Now.include('./sys_script_b263f1d01dea4f98903af0f0c9ecde20.server.js'),
})
