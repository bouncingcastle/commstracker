import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['7ae982a73b8b4a55b3784ee7facc613a'],
    name: 'Deal Type Validation - Calculations',
    table: 'x_823178_commissio_commission_calculations',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates calculation deal type against active governed deal types when value is present',
    script: Now.include('./sys_script_7ae982a73b8b4a55b3784ee7facc613a.server.js'),
})
