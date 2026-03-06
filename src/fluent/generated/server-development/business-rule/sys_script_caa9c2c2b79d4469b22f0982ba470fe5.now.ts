import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['caa9c2c2b79d4469b22f0982ba470fe5'],
    name: 'Deal Type Validation - Calculations',
    table: 'x_823178_commissio_commission_calculations',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates calculation deal type against active governed deal types when value is present',
    script: Now.include('./sys_script_caa9c2c2b79d4469b22f0982ba470fe5.server.js'),
})
