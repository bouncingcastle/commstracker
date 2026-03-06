import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['17ab01221ddc4cb9b7acdfea6b2e6adc'],
    name: 'Deal Type Validation - Plan Tiers',
    table: 'x_823178_commissio_plan_tiers',
    order: 45,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Ensures plan tier records use active governed deal types or supported scope values',
    script: Now.include('./sys_script_17ab01221ddc4cb9b7acdfea6b2e6adc.server.js'),
})
