import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['b57a9b5959e44251953c539554d85757'],
    name: 'Deal Type Validation - Calculations',
    table: 'x_823178_commissio_commission_calculations',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates calculation deal type against active governed deal types when value is present',
    script: Now.include('./sys_script_b57a9b5959e44251953c539554d85757.server.js'),
})
