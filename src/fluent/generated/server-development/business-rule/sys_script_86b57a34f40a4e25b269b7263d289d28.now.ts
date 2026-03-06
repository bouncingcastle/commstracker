import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['86b57a34f40a4e25b269b7263d289d28'],
    name: 'Deal Type Validation - Plan Bonuses',
    table: 'x_823178_commissio_plan_bonuses',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Ensures plan bonus records use active governed deal types or supported scope values',
    script: Now.include('./sys_script_86b57a34f40a4e25b269b7263d289d28.server.js'),
})
