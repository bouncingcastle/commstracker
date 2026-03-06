import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['558c57a7171341edaddae8d9a59d5411'],
    name: 'Deal Type Governance Validation',
    table: 'x_823178_commissio_deal_types',
    order: 40,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Enforces deal type lifecycle controls, impact checks, and override requirements for deactivation',
    script: Now.include('./sys_script_558c57a7171341edaddae8d9a59d5411.server.js'),
})
