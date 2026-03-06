import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['bdbb87aa1d004341b2af6fef5e5ed014'],
    name: 'Deal Type Validation - Calculations',
    table: 'x_823178_commissio_commission_calculations',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates calculation deal type against active governed deal types when value is present',
    script: Now.include('./sys_script_bdbb87aa1d004341b2af6fef5e5ed014.server.js'),
})
