import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['735c551410bd41daae013a3e5b50a22f'],
    name: 'Deal Type Governance Validation',
    table: 'x_823178_commissio_deal_types',
    order: 40,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Enforces deal type lifecycle controls, impact checks, and override requirements for deactivation',
    script: Now.include('./sys_script_735c551410bd41daae013a3e5b50a22f.server.js'),
})
