import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['eed76422a5a847d48d03d72b74072223'],
    name: 'Deal Type Governance Validation',
    table: 'x_823178_commissio_deal_types',
    order: 40,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Enforces deal type lifecycle controls, impact checks, and override requirements for deactivation',
    script: Now.include('./sys_script_eed76422a5a847d48d03d72b74072223.server.js'),
})
