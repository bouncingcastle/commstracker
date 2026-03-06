import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['b17a41176ed8489d89ff6b11309e0fa7'],
    name: 'Deal Type Validation - Plan Tiers',
    table: 'x_823178_commissio_plan_tiers',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Ensures plan tier records use active governed deal types or supported scope values',
    script: Now.include('./sys_script_b17a41176ed8489d89ff6b11309e0fa7.server.js'),
})
