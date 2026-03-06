import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['d73f9c2f97b848a18076e74f49608bd4'],
    name: 'Deal Type Validation - Calculations',
    table: 'x_823178_commissio_commission_calculations',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates calculation deal type against active governed deal types when value is present',
    script: Now.include('./sys_script_d73f9c2f97b848a18076e74f49608bd4.server.js'),
})
