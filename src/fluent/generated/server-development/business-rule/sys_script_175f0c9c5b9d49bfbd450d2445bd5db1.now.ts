import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['175f0c9c5b9d49bfbd450d2445bd5db1'],
    name: 'Deal Type Validation - Plan Targets',
    table: 'x_823178_commissio_plan_targets',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Ensures plan target records use active governed deal types',
    script: Now.include('./sys_script_175f0c9c5b9d49bfbd450d2445bd5db1.server.js'),
})
