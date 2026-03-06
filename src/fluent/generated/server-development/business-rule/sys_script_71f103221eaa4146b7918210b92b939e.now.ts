import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['71f103221eaa4146b7918210b92b939e'],
    name: 'Deal Type Validation - Plan Targets',
    table: 'x_823178_commissio_plan_targets',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Ensures plan target records use active governed deal types',
    script: Now.include('./sys_script_71f103221eaa4146b7918210b92b939e.server.js'),
})
