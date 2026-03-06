import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['f4b3d6189ab247fb8d6af80bdd2e6a42'],
    name: 'Deal Type Validation - Calculations',
    table: 'x_823178_commissio_commission_calculations',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates calculation deal type against active governed deal types when value is present',
    script: Now.include('./sys_script_f4b3d6189ab247fb8d6af80bdd2e6a42.server.js'),
})
