import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['67f4af6650284027ad519fc48da07e97'],
    name: 'Commission Plan Tier Validation',
    table: 'x_823178_commissio_plan_tiers',
    order: 40,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates tier scope and range bands to prevent ambiguous or overlapping setup',
    script: Now.include('./sys_script_67f4af6650284027ad519fc48da07e97.server.js'),
})
