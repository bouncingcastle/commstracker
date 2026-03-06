import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['ffb8da9f38f34e1baa0adade76cca633'],
    name: 'Deal Type Validation - Calculations',
    table: 'x_823178_commissio_commission_calculations',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates calculation deal type against active governed deal types when value is present',
    script: Now.include('./sys_script_ffb8da9f38f34e1baa0adade76cca633.server.js'),
})
