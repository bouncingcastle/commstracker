import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['37fb7869f2e24cea89a1bbf655c28cd5'],
    name: 'Deal Type Validation - Plan Bonuses',
    table: 'x_823178_commissio_plan_bonuses',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Ensures plan bonus records use active governed deal types or supported scope values',
    script: Now.include('./sys_script_37fb7869f2e24cea89a1bbf655c28cd5.server.js'),
})
