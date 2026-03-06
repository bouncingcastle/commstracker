import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['07a9df8de9be4b5f9e5504357a3bf812'],
    name: 'Deal Type Validation - Plan Tiers',
    table: 'x_823178_commissio_plan_tiers',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Ensures plan tier records use active governed deal types or supported scope values',
    script: Now.include('./sys_script_07a9df8de9be4b5f9e5504357a3bf812.server.js'),
})
