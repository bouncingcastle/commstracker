import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['c77ee1f5f3994c70ad755e2cdd16da93'],
    name: 'Deal Type Validation - Plan Bonuses',
    table: 'x_823178_commissio_plan_bonuses',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Ensures plan bonus records use active governed deal types or supported scope values',
    script: Now.include('./sys_script_c77ee1f5f3994c70ad755e2cdd16da93.server.js'),
})
