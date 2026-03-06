import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['2b409e9d92234d6faa6ca90c9a61546c'],
    name: 'Deal Type Validation - Plan Tiers',
    table: 'x_823178_commissio_plan_tiers',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Ensures plan tier records use active governed deal types or supported scope values',
    script: Now.include('./sys_script_2b409e9d92234d6faa6ca90c9a61546c.server.js'),
})
