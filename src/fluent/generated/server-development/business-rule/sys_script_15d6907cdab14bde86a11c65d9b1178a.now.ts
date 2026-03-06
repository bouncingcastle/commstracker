import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['15d6907cdab14bde86a11c65d9b1178a'],
    name: 'Deal Type Validation - Calculations',
    table: 'x_823178_commissio_commission_calculations',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates calculation deal type against active governed deal types when value is present',
    script: Now.include('./sys_script_15d6907cdab14bde86a11c65d9b1178a.server.js'),
})
