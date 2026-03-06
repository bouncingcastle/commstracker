import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['3258e4c3e3c14ed683d690572c0b46d4'],
    name: 'Deal Type Validation - Plan Bonuses',
    table: 'x_823178_commissio_plan_bonuses',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Ensures plan bonus records use active governed deal types or supported scope values',
    script: Now.include('./sys_script_3258e4c3e3c14ed683d690572c0b46d4.server.js'),
})
