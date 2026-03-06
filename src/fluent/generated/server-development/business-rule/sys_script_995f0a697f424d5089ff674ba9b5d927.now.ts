import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['995f0a697f424d5089ff674ba9b5d927'],
    name: 'Deal Type Governance Validation',
    table: 'x_823178_commissio_deal_types',
    order: 40,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Enforces deal type lifecycle controls, impact checks, and override requirements for deactivation',
    script: Now.include('./sys_script_995f0a697f424d5089ff674ba9b5d927.server.js'),
})
