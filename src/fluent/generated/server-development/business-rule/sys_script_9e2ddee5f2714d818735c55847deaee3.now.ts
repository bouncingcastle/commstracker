import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['9e2ddee5f2714d818735c55847deaee3'],
    name: 'Commission Plan Tier Validation',
    table: 'x_823178_commissio_plan_tiers',
    order: 40,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates tier scope and range bands to prevent ambiguous or overlapping setup',
    script: Now.include('./sys_script_9e2ddee5f2714d818735c55847deaee3.server.js'),
})
