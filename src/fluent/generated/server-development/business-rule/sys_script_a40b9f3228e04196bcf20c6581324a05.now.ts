import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['a40b9f3228e04196bcf20c6581324a05'],
    name: 'Deal Type Governance Validation',
    table: 'x_823178_commissio_deal_types',
    order: 40,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Enforces deal type lifecycle controls, impact checks, and override requirements for deactivation',
    script: Now.include('./sys_script_a40b9f3228e04196bcf20c6581324a05.server.js'),
})
