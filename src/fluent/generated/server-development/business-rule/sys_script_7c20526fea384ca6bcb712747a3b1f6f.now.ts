import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['7c20526fea384ca6bcb712747a3b1f6f'],
    name: 'Deal Type Validation - Plan Bonuses',
    table: 'x_823178_commissio_plan_bonuses',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Ensures plan bonus records use active governed deal types or supported scope values',
    script: Now.include('./sys_script_7c20526fea384ca6bcb712747a3b1f6f.server.js'),
})
