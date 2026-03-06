import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['613b1be417d249db9bac9e5e1f4476ed'],
    name: 'Deal Type Validation - Calculations',
    table: 'x_823178_commissio_commission_calculations',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates calculation deal type against active governed deal types when value is present',
    script: Now.include('./sys_script_613b1be417d249db9bac9e5e1f4476ed.server.js'),
})
