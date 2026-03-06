import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['4b047dbdca13414394254481a7186ba4'],
    name: 'Deal Type Validation - Calculations',
    table: 'x_823178_commissio_commission_calculations',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates calculation deal type against active governed deal types when value is present',
    script: Now.include('./sys_script_4b047dbdca13414394254481a7186ba4.server.js'),
})
