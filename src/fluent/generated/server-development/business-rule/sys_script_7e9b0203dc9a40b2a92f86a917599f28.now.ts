import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['7e9b0203dc9a40b2a92f86a917599f28'],
    name: 'Deal Type Validation - Plan Tiers',
    table: 'x_823178_commissio_plan_tiers',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Ensures plan tier records use active governed deal types or supported scope values',
    script: Now.include('./sys_script_7e9b0203dc9a40b2a92f86a917599f28.server.js'),
})
