import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['dcf8e28997244d72bff47bddcb434cc5'],
    name: 'Deal Type Validation - Plan Tiers',
    table: 'x_823178_commissio_plan_tiers',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Ensures plan tier records use active governed deal types or supported scope values',
    script: Now.include('./sys_script_dcf8e28997244d72bff47bddcb434cc5.server.js'),
})
