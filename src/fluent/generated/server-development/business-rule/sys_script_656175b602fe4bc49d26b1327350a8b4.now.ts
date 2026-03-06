import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['656175b602fe4bc49d26b1327350a8b4'],
    name: 'Deal Type Validation - Plan Tiers',
    table: 'x_823178_commissio_plan_tiers',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Ensures plan tier records use active governed deal types or supported scope values',
    script: Now.include('./sys_script_656175b602fe4bc49d26b1327350a8b4.server.js'),
})
