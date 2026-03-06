import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['fd78727401f94e1db334d302a4726ded'],
    name: 'Commission Plan Tier Validation',
    table: 'x_823178_commissio_plan_tiers',
    order: 40,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates tier scope and range bands to prevent ambiguous or overlapping setup',
    script: Now.include('./sys_script_fd78727401f94e1db334d302a4726ded.server.js'),
})
