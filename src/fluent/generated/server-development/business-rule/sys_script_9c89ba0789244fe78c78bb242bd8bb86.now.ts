import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['9c89ba0789244fe78c78bb242bd8bb86'],
    name: 'Deal Type Validation - Plan Tiers',
    table: 'x_823178_commissio_plan_tiers',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Ensures plan tier records use active governed deal types or supported scope values',
    script: Now.include('./sys_script_9c89ba0789244fe78c78bb242bd8bb86.server.js'),
})
