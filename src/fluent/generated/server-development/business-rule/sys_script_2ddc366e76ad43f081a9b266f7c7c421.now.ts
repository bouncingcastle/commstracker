import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['2ddc366e76ad43f081a9b266f7c7c421'],
    name: 'Deal Type Governance Validation',
    table: 'x_823178_commissio_deal_types',
    order: 40,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Enforces deal type lifecycle controls, impact checks, and override requirements for deactivation',
    script: Now.include('./sys_script_2ddc366e76ad43f081a9b266f7c7c421.server.js'),
})
