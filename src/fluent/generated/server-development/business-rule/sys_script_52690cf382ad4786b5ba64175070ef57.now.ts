import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['52690cf382ad4786b5ba64175070ef57'],
    name: 'Deal Type Validation - Plan Bonuses',
    table: 'x_823178_commissio_plan_bonuses',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Ensures plan bonus records use active governed deal types or supported scope values',
    script: Now.include('./sys_script_52690cf382ad4786b5ba64175070ef57.server.js'),
})
