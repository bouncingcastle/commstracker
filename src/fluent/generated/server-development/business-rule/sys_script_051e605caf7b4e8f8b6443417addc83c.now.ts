import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['051e605caf7b4e8f8b6443417addc83c'],
    name: 'Deal Type Governance Validation',
    table: 'x_823178_commissio_deal_types',
    order: 40,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Enforces deal type lifecycle controls, impact checks, and override requirements for deactivation',
    script: Now.include('./sys_script_051e605caf7b4e8f8b6443417addc83c.server.js'),
})
