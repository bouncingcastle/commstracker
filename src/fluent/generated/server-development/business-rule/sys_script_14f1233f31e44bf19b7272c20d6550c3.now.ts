import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['14f1233f31e44bf19b7272c20d6550c3'],
    name: 'Deal Type Governance Validation',
    table: 'x_823178_commissio_deal_types',
    order: 40,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Enforces deal type lifecycle controls, impact checks, and override requirements for deactivation',
    script: Now.include('./sys_script_14f1233f31e44bf19b7272c20d6550c3.server.js'),
})
