import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['f28a0877b0bf443d85adcc1ad9bdfb9a'],
    name: 'Deal Type Validation - Plan Targets',
    table: 'x_823178_commissio_plan_targets',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Ensures plan target records use active governed deal types',
    script: Now.include('./sys_script_f28a0877b0bf443d85adcc1ad9bdfb9a.server.js'),
})
