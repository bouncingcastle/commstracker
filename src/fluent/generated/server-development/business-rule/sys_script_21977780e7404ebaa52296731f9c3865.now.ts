import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['21977780e7404ebaa52296731f9c3865'],
    name: 'Deal Type Governance Validation',
    table: 'x_823178_commissio_deal_types',
    order: 40,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Enforces deal type lifecycle controls, impact checks, and override requirements for deactivation',
    script: Now.include('./sys_script_21977780e7404ebaa52296731f9c3865.server.js'),
})
