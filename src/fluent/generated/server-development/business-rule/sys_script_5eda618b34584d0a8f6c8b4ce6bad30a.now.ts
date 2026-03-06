import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['5eda618b34584d0a8f6c8b4ce6bad30a'],
    name: 'Deal Type Governance Validation',
    table: 'x_823178_commissio_deal_types',
    order: 40,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Enforces deal type lifecycle controls, impact checks, and override requirements for deactivation',
    script: Now.include('./sys_script_5eda618b34584d0a8f6c8b4ce6bad30a.server.js'),
})
