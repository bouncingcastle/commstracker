import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['b42ce152615c47c18de2d7f14904b30e'],
    name: 'Deal Type Validation - Plan Targets',
    table: 'x_823178_commissio_plan_targets',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Ensures plan target records use active governed deal types',
    script: Now.include('./sys_script_b42ce152615c47c18de2d7f14904b30e.server.js'),
})
