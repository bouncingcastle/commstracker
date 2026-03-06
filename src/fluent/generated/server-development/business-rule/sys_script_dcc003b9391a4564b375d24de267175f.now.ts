import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['dcc003b9391a4564b375d24de267175f'],
    name: 'Deal Type Validation - Plan Tiers',
    table: 'x_823178_commissio_plan_tiers',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Ensures plan tier records use active governed deal types or supported scope values',
    script: Now.include('./sys_script_dcc003b9391a4564b375d24de267175f.server.js'),
})
