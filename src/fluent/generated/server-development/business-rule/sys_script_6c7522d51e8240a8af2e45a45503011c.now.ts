import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['6c7522d51e8240a8af2e45a45503011c'],
    name: 'Deal Type Validation - Plan Bonuses',
    table: 'x_823178_commissio_plan_bonuses',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Ensures plan bonus records use active governed deal types or supported scope values',
    script: Now.include('./sys_script_6c7522d51e8240a8af2e45a45503011c.server.js'),
})
