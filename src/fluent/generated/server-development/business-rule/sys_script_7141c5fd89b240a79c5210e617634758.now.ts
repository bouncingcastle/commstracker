import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['7141c5fd89b240a79c5210e617634758'],
    name: 'Deal Type Validation - Plan Targets',
    table: 'x_823178_commissio_plan_targets',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Ensures plan target records use active governed deal types',
    script: Now.include('./sys_script_7141c5fd89b240a79c5210e617634758.server.js'),
})
