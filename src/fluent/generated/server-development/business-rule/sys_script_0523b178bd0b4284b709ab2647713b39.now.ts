import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['0523b178bd0b4284b709ab2647713b39'],
    name: 'Commission Plan Tier Validation',
    table: 'x_823178_commissio_plan_tiers',
    order: 40,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates tier scope and range bands to prevent ambiguous or overlapping setup',
    script: Now.include('./sys_script_0523b178bd0b4284b709ab2647713b39.server.js'),
})
