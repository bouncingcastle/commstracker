import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['e837c59546a6494db22a1db729b13d9a'],
    name: 'Deal Type Validation - Plan Tiers',
    table: 'x_823178_commissio_plan_tiers',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Ensures plan tier records use active governed deal types or supported scope values',
    script: Now.include('./sys_script_e837c59546a6494db22a1db729b13d9a.server.js'),
})
