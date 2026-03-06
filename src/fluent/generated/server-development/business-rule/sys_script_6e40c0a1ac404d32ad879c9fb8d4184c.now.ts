import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['6e40c0a1ac404d32ad879c9fb8d4184c'],
    name: 'Commission Plan Tier Validation',
    table: 'x_823178_commissio_plan_tiers',
    order: 40,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates tier scope and range bands to prevent ambiguous or overlapping setup',
    script: Now.include('./sys_script_6e40c0a1ac404d32ad879c9fb8d4184c.server.js'),
})
