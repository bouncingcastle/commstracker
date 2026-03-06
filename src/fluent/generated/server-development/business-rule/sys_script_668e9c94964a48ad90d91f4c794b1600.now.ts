import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['668e9c94964a48ad90d91f4c794b1600'],
    name: 'Deal Type Governance Validation',
    table: 'x_823178_commissio_deal_types',
    order: 40,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Enforces deal type lifecycle controls, impact checks, and override requirements for deactivation',
    script: Now.include('./sys_script_668e9c94964a48ad90d91f4c794b1600.server.js'),
})
