import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['fef5261de814472582cc899c6b34671f'],
    name: 'Deal Type Validation - Plan Bonuses',
    table: 'x_823178_commissio_plan_bonuses',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Ensures plan bonus records use active governed deal types or supported scope values',
    script: Now.include('./sys_script_fef5261de814472582cc899c6b34671f.server.js'),
})
