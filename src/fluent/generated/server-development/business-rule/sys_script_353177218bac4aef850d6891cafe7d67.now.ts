import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['353177218bac4aef850d6891cafe7d67'],
    name: 'Deal Type Validation - Plan Tiers',
    table: 'x_823178_commissio_plan_tiers',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Ensures plan tier records use active governed deal types or supported scope values',
    script: Now.include('./sys_script_353177218bac4aef850d6891cafe7d67.server.js'),
})
