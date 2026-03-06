import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['b92ecc1215c44b3ea39d8bd370fc98c9'],
    name: 'Deal Type Validation - Calculations',
    table: 'x_823178_commissio_commission_calculations',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates calculation deal type against active governed deal types when value is present',
    script: Now.include('./sys_script_b92ecc1215c44b3ea39d8bd370fc98c9.server.js'),
})
