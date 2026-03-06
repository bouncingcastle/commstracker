import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['706c083cd4264ecbb4830abf83f560c5'],
    name: 'Deal Type Validation - Plan Tiers',
    table: 'x_823178_commissio_plan_tiers',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Ensures plan tier records use active governed deal types or supported scope values',
    script: Now.include('./sys_script_706c083cd4264ecbb4830abf83f560c5.server.js'),
})
