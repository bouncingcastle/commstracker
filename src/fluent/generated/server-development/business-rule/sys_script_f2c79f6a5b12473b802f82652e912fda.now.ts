import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['f2c79f6a5b12473b802f82652e912fda'],
    name: 'Deal Type Validation - Plan Targets',
    table: 'x_823178_commissio_plan_targets',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Ensures plan target records use active governed deal types',
    script: Now.include('./sys_script_f2c79f6a5b12473b802f82652e912fda.server.js'),
})
