import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['94929fc0b647419a9da1f2efb27542bc'],
    name: 'Deal Type Governance Validation',
    table: 'x_823178_commissio_deal_types',
    order: 40,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Enforces deal type lifecycle controls, impact checks, and override requirements for deactivation',
    script: Now.include('./sys_script_94929fc0b647419a9da1f2efb27542bc.server.js'),
})
