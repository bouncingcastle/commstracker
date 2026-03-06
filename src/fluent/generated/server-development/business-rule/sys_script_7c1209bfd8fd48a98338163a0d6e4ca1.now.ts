import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['7c1209bfd8fd48a98338163a0d6e4ca1'],
    name: 'Deal Type Validation - Calculations',
    table: 'x_823178_commissio_commission_calculations',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates calculation deal type against active governed deal types when value is present',
    script: Now.include('./sys_script_7c1209bfd8fd48a98338163a0d6e4ca1.server.js'),
})
