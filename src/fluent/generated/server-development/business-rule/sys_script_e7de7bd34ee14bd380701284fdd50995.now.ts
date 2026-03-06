import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['e7de7bd34ee14bd380701284fdd50995'],
    name: 'Deal Type Governance Validation',
    table: 'x_823178_commissio_deal_types',
    order: 40,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Enforces deal type lifecycle controls, impact checks, and override requirements for deactivation',
    script: Now.include('./sys_script_e7de7bd34ee14bd380701284fdd50995.server.js'),
})
