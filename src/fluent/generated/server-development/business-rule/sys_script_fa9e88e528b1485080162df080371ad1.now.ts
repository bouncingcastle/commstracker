import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['fa9e88e528b1485080162df080371ad1'],
    name: 'Deal Type Governance Validation',
    table: 'x_823178_commissio_deal_types',
    order: 40,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Enforces deal type lifecycle controls, impact checks, and override requirements for deactivation',
    script: Now.include('./sys_script_fa9e88e528b1485080162df080371ad1.server.js'),
})
