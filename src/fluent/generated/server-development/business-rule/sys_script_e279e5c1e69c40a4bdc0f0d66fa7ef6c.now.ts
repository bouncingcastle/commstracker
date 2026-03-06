import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['e279e5c1e69c40a4bdc0f0d66fa7ef6c'],
    name: 'Deal Type Validation - Plan Targets',
    table: 'x_823178_commissio_plan_targets',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Ensures plan target records use active governed deal types',
    script: Now.include('./sys_script_e279e5c1e69c40a4bdc0f0d66fa7ef6c.server.js'),
})
