import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['821aa13168294959a3b1ac2fb250080a'],
    name: 'Deal Type Governance Validation',
    table: 'x_823178_commissio_deal_types',
    order: 40,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Enforces deal type lifecycle controls, impact checks, and override requirements for deactivation',
    script: Now.include('./sys_script_821aa13168294959a3b1ac2fb250080a.server.js'),
})
