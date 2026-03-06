import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['2293f8d47d8446f8be0744017372229c'],
    name: 'Deal Type Governance Validation',
    table: 'x_823178_commissio_deal_types',
    order: 40,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Enforces deal type lifecycle controls, impact checks, and override requirements for deactivation',
    script: Now.include('./sys_script_2293f8d47d8446f8be0744017372229c.server.js'),
})
