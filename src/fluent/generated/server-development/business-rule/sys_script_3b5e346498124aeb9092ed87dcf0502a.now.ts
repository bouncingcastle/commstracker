import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['3b5e346498124aeb9092ed87dcf0502a'],
    name: 'Deal Type Governance Validation',
    table: 'x_823178_commissio_deal_types',
    order: 40,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Enforces deal type lifecycle controls, impact checks, and override requirements for deactivation',
    script: Now.include('./sys_script_3b5e346498124aeb9092ed87dcf0502a.server.js'),
})
