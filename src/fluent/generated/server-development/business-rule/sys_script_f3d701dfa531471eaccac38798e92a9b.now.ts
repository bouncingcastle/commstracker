import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['f3d701dfa531471eaccac38798e92a9b'],
    name: 'Commission Plan Tier Validation',
    table: 'x_823178_commissio_plan_tiers',
    order: 40,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates tier scope and range bands to prevent ambiguous or overlapping setup',
    script: Now.include('./sys_script_f3d701dfa531471eaccac38798e92a9b.server.js'),
})
