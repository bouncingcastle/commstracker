import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['73b4d56ef05e459ca9e62cdf4c6b8f52'],
    name: 'Deal Type Governance Validation',
    table: 'x_823178_commissio_deal_types',
    order: 40,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Enforces deal type lifecycle controls, impact checks, and override requirements for deactivation',
    script: Now.include('./sys_script_73b4d56ef05e459ca9e62cdf4c6b8f52.server.js'),
})
