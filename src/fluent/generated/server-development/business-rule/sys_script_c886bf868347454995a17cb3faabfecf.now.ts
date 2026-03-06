import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['c886bf868347454995a17cb3faabfecf'],
    name: 'Deal Type Governance Validation',
    table: 'x_823178_commissio_deal_types',
    order: 40,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Enforces deal type lifecycle controls, impact checks, and override requirements for deactivation',
    script: Now.include('./sys_script_c886bf868347454995a17cb3faabfecf.server.js'),
})
