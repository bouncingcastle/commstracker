import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['337d368e03714ed4a445e0a46c8df89b'],
    name: 'Commission Plan Tier Validation',
    table: 'x_823178_commissio_plan_tiers',
    order: 40,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates tier scope and range bands to prevent ambiguous or overlapping setup',
    script: Now.include('./sys_script_337d368e03714ed4a445e0a46c8df89b.server.js'),
})
