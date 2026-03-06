import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['f1073f97c02f449e8b34cafec8b5b44d'],
    name: 'Deal Type Validation - Calculations',
    table: 'x_823178_commissio_commission_calculations',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates calculation deal type against active governed deal types when value is present',
    script: Now.include('./sys_script_f1073f97c02f449e8b34cafec8b5b44d.server.js'),
})
