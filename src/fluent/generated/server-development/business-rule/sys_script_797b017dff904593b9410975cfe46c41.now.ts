import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['797b017dff904593b9410975cfe46c41'],
    name: 'Commission Plan Tier Validation',
    table: 'x_823178_commissio_plan_tiers',
    order: 40,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates tier scope and range bands to prevent ambiguous or overlapping setup',
    script: Now.include('./sys_script_797b017dff904593b9410975cfe46c41.server.js'),
})
