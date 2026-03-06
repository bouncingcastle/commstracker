import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['95c46c224a4f4de185298ae92680f9ea'],
    name: 'Deal Type Validation - Calculations',
    table: 'x_823178_commissio_commission_calculations',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates calculation deal type against active governed deal types when value is present',
    script: Now.include('./sys_script_95c46c224a4f4de185298ae92680f9ea.server.js'),
})
