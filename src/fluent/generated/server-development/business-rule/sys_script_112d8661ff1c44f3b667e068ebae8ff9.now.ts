import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['112d8661ff1c44f3b667e068ebae8ff9'],
    name: 'Deal Type Validation - Plan Targets',
    table: 'x_823178_commissio_plan_targets',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Ensures plan target records use active governed deal types',
    script: Now.include('./sys_script_112d8661ff1c44f3b667e068ebae8ff9.server.js'),
})
