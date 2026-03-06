import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['fe6aebb0f80a42898582763f5699d10f'],
    name: 'Deal Type Governance Validation',
    table: 'x_823178_commissio_deal_types',
    order: 40,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Enforces deal type lifecycle controls, impact checks, and override requirements for deactivation',
    script: Now.include('./sys_script_fe6aebb0f80a42898582763f5699d10f.server.js'),
})
