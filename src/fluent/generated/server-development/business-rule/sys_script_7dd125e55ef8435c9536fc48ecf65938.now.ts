import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['7dd125e55ef8435c9536fc48ecf65938'],
    name: 'Deal Type Validation - Plan Targets',
    table: 'x_823178_commissio_plan_targets',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Ensures plan target records use active governed deal types',
    script: Now.include('./sys_script_7dd125e55ef8435c9536fc48ecf65938.server.js'),
})
