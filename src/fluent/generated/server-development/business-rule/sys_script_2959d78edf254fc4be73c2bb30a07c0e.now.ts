import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['2959d78edf254fc4be73c2bb30a07c0e'],
    name: 'Deal Type Governance Validation',
    table: 'x_823178_commissio_deal_types',
    order: 40,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Enforces deal type lifecycle controls, impact checks, and override requirements for deactivation',
    script: Now.include('./sys_script_2959d78edf254fc4be73c2bb30a07c0e.server.js'),
})
