import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['6fa7b216c288495ca118d825d2f24354'],
    name: 'Deal Type Governance Validation',
    table: 'x_823178_commissio_deal_types',
    order: 40,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Enforces deal type lifecycle controls, impact checks, and override requirements for deactivation',
    script: Now.include('./sys_script_6fa7b216c288495ca118d825d2f24354.server.js'),
})
