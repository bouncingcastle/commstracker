import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['6ec8f6dd3e9149faaa99ff805898dfb3'],
    name: 'Deal Type Validation - Calculations',
    table: 'x_823178_commissio_commission_calculations',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates calculation deal type against active governed deal types when value is present',
    script: Now.include('./sys_script_6ec8f6dd3e9149faaa99ff805898dfb3.server.js'),
})
