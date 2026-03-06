import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['18b496d908214ee0b240fb26ef6ac7ff'],
    name: 'Deal Type Governance Validation',
    table: 'x_823178_commissio_deal_types',
    order: 40,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Enforces deal type lifecycle controls, impact checks, and override requirements for deactivation',
    script: Now.include('./sys_script_18b496d908214ee0b240fb26ef6ac7ff.server.js'),
})
