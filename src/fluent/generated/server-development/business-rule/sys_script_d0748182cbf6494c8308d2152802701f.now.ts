import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['d0748182cbf6494c8308d2152802701f'],
    name: 'Deal Type Governance Validation',
    table: 'x_823178_commissio_deal_types',
    order: 40,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Enforces deal type lifecycle controls, impact checks, and override requirements for deactivation',
    script: Now.include('./sys_script_d0748182cbf6494c8308d2152802701f.server.js'),
})
