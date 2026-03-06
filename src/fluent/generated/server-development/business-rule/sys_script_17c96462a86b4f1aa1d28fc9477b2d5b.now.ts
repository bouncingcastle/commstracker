import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['17c96462a86b4f1aa1d28fc9477b2d5b'],
    name: 'Deal Type Validation - Calculations',
    table: 'x_823178_commissio_commission_calculations',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates calculation deal type against active governed deal types when value is present',
    script: Now.include('./sys_script_17c96462a86b4f1aa1d28fc9477b2d5b.server.js'),
})
