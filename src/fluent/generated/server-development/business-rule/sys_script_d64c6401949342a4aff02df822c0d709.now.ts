import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['d64c6401949342a4aff02df822c0d709'],
    name: 'Deal Type Validation - Calculations',
    table: 'x_823178_commissio_commission_calculations',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates calculation deal type against active governed deal types when value is present',
    script: Now.include('./sys_script_d64c6401949342a4aff02df822c0d709.server.js'),
})
