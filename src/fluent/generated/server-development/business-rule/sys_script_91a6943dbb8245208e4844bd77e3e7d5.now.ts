import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['91a6943dbb8245208e4844bd77e3e7d5'],
    name: 'Deal Type Governance Validation',
    table: 'x_823178_commissio_deal_types',
    order: 40,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Enforces deal type lifecycle controls, impact checks, and override requirements for deactivation',
    script: Now.include('./sys_script_91a6943dbb8245208e4844bd77e3e7d5.server.js'),
})
