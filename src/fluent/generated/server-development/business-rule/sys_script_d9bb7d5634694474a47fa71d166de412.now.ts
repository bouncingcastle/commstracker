import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['d9bb7d5634694474a47fa71d166de412'],
    name: 'Deal Type Validation - Calculations',
    table: 'x_823178_commissio_commission_calculations',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates calculation deal type against active governed deal types when value is present',
    script: Now.include('./sys_script_d9bb7d5634694474a47fa71d166de412.server.js'),
})
