import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['2d7375a2aaab45a6a92b5a73879ce200'],
    name: 'Commission Plan Tier Validation',
    table: 'x_823178_commissio_plan_tiers',
    order: 40,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates tier scope and range bands to prevent ambiguous or overlapping setup',
    script: Now.include('./sys_script_2d7375a2aaab45a6a92b5a73879ce200.server.js'),
})
