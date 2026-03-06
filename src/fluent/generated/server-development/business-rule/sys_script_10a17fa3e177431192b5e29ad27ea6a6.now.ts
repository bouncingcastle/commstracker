import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['10a17fa3e177431192b5e29ad27ea6a6'],
    name: 'Deal Type Governance Validation',
    table: 'x_823178_commissio_deal_types',
    order: 40,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Enforces deal type lifecycle controls, impact checks, and override requirements for deactivation',
    script: Now.include('./sys_script_10a17fa3e177431192b5e29ad27ea6a6.server.js'),
})
