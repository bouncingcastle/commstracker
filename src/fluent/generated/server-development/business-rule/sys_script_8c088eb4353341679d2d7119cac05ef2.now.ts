import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['8c088eb4353341679d2d7119cac05ef2'],
    name: 'Deal Type Validation - Plan Tiers',
    table: 'x_823178_commissio_plan_tiers',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Ensures plan tier records use active governed deal types or supported scope values',
    script: Now.include('./sys_script_8c088eb4353341679d2d7119cac05ef2.server.js'),
})
