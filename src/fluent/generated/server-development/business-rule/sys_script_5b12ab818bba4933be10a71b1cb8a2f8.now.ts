import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['5b12ab818bba4933be10a71b1cb8a2f8'],
    name: 'Deal Type Validation - Plan Bonuses',
    table: 'x_823178_commissio_plan_bonuses',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Ensures plan bonus records use active governed deal types or supported scope values',
    script: Now.include('./sys_script_5b12ab818bba4933be10a71b1cb8a2f8.server.js'),
})
