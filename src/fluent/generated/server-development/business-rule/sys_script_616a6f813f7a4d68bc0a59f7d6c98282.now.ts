import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['616a6f813f7a4d68bc0a59f7d6c98282'],
    name: 'Deal Type Validation - Plan Bonuses',
    table: 'x_823178_commissio_plan_bonuses',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Ensures plan bonus records use active governed deal types or supported scope values',
    script: Now.include('./sys_script_616a6f813f7a4d68bc0a59f7d6c98282.server.js'),
})
