import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['ac89727661d34a7d918f348d524c6ac4'],
    name: 'Deal Type Validation - Calculations',
    table: 'x_823178_commissio_commission_calculations',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates calculation deal type against active governed deal types when value is present',
    script: Now.include('./sys_script_ac89727661d34a7d918f348d524c6ac4.server.js'),
})
