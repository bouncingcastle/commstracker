import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['6b972a6fe8f749d8b6e34e47d9d36765'],
    name: 'Deal Type Validation - Plan Targets',
    table: 'x_823178_commissio_plan_targets',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Ensures plan target records use active governed deal types',
    script: Now.include('./sys_script_6b972a6fe8f749d8b6e34e47d9d36765.server.js'),
})
