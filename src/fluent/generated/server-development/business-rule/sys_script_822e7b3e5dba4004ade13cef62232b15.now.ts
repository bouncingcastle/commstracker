import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['822e7b3e5dba4004ade13cef62232b15'],
    name: 'Deal Type Governance Validation',
    table: 'x_823178_commissio_deal_types',
    order: 40,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Enforces deal type lifecycle controls, impact checks, and override requirements for deactivation',
    script: Now.include('./sys_script_822e7b3e5dba4004ade13cef62232b15.server.js'),
})
