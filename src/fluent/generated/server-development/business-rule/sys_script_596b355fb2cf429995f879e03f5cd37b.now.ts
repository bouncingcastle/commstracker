import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['596b355fb2cf429995f879e03f5cd37b'],
    name: 'Deal Type Validation - Calculations',
    table: 'x_823178_commissio_commission_calculations',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates calculation deal type against active governed deal types when value is present',
    script: Now.include('./sys_script_596b355fb2cf429995f879e03f5cd37b.server.js'),
})
