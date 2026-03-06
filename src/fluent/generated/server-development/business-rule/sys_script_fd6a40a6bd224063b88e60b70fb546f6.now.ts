import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['fd6a40a6bd224063b88e60b70fb546f6'],
    name: 'Commission Plan Tier Validation',
    table: 'x_823178_commissio_plan_tiers',
    order: 40,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates tier scope and range bands to prevent ambiguous or overlapping setup',
    script: Now.include('./sys_script_fd6a40a6bd224063b88e60b70fb546f6.server.js'),
})
