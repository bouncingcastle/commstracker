import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['1ccb928ea2d54eff8d816221b1f9283b'],
    name: 'Deal Type Validation - Plan Bonuses',
    table: 'x_823178_commissio_plan_bonuses',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Ensures plan bonus records use active governed deal types or supported scope values',
    script: Now.include('./sys_script_1ccb928ea2d54eff8d816221b1f9283b.server.js'),
})
