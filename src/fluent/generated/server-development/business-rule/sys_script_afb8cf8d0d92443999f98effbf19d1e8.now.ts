import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['afb8cf8d0d92443999f98effbf19d1e8'],
    name: 'Deal Type Validation - Calculations',
    table: 'x_823178_commissio_commission_calculations',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates calculation deal type against active governed deal types when value is present',
    script: Now.include('./sys_script_afb8cf8d0d92443999f98effbf19d1e8.server.js'),
})
