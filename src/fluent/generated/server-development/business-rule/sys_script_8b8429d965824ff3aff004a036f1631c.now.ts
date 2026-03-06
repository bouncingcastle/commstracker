import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['8b8429d965824ff3aff004a036f1631c'],
    name: 'Deal Type Validation - Calculations',
    table: 'x_823178_commissio_commission_calculations',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates calculation deal type against active governed deal types when value is present',
    script: Now.include('./sys_script_8b8429d965824ff3aff004a036f1631c.server.js'),
})
