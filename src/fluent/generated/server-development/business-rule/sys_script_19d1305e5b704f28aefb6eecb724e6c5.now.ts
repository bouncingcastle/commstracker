import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['19d1305e5b704f28aefb6eecb724e6c5'],
    name: 'Deal Type Validation - Plan Targets',
    table: 'x_823178_commissio_plan_targets',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Ensures plan target records use active governed deal types',
    script: Now.include('./sys_script_19d1305e5b704f28aefb6eecb724e6c5.server.js'),
})
