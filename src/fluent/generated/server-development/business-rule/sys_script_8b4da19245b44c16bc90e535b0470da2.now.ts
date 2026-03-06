import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['8b4da19245b44c16bc90e535b0470da2'],
    name: 'Deal Type Validation - Plan Bonuses',
    table: 'x_823178_commissio_plan_bonuses',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Ensures plan bonus records use active governed deal types or supported scope values',
    script: Now.include('./sys_script_8b4da19245b44c16bc90e535b0470da2.server.js'),
})
