import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['14b38c68b72047118f12c8ddf24540ac'],
    name: 'Commission Plan Tier Validation',
    table: 'x_823178_commissio_plan_tiers',
    order: 40,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates tier scope and range bands to prevent ambiguous or overlapping setup',
    script: Now.include('./sys_script_14b38c68b72047118f12c8ddf24540ac.server.js'),
})
