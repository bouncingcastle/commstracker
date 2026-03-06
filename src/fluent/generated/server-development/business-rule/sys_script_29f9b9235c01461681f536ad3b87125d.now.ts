import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['29f9b9235c01461681f536ad3b87125d'],
    name: 'Deal Type Validation - Calculations',
    table: 'x_823178_commissio_commission_calculations',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates calculation deal type against active governed deal types when value is present',
    script: Now.include('./sys_script_29f9b9235c01461681f536ad3b87125d.server.js'),
})
