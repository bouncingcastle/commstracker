import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['c01bcfa1e0654217af837ed1fe30015e'],
    name: 'Commission Plan Tier Validation',
    table: 'x_823178_commissio_plan_tiers',
    order: 40,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates tier scope and range bands to prevent ambiguous or overlapping setup',
    script: Now.include('./sys_script_c01bcfa1e0654217af837ed1fe30015e.server.js'),
})
