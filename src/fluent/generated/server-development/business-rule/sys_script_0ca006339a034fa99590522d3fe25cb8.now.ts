import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['0ca006339a034fa99590522d3fe25cb8'],
    name: 'Deal Type Validation - Calculations',
    table: 'x_823178_commissio_commission_calculations',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates calculation deal type against active governed deal types when value is present',
    script: Now.include('./sys_script_0ca006339a034fa99590522d3fe25cb8.server.js'),
})
