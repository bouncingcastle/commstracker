import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['c2e803b259c546ec9c284848e1ecb609'],
    name: 'Commission Plan Tier Validation',
    table: 'x_823178_commissio_plan_tiers',
    order: 40,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates tier scope and range bands to prevent ambiguous or overlapping setup',
    script: Now.include('./sys_script_c2e803b259c546ec9c284848e1ecb609.server.js'),
})
