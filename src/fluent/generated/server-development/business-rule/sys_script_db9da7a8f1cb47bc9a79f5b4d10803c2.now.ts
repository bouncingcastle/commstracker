import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['db9da7a8f1cb47bc9a79f5b4d10803c2'],
    name: 'Deal Type Validation - Calculations',
    table: 'x_823178_commissio_commission_calculations',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates calculation deal type against active governed deal types when value is present',
    script: Now.include('./sys_script_db9da7a8f1cb47bc9a79f5b4d10803c2.server.js'),
})
