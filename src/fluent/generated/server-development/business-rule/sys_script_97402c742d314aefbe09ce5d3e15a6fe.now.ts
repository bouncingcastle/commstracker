import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['97402c742d314aefbe09ce5d3e15a6fe'],
    name: 'Commission Plan Tier Validation',
    table: 'x_823178_commissio_plan_tiers',
    order: 40,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates tier scope and range bands to prevent ambiguous or overlapping setup',
    script: Now.include('./sys_script_97402c742d314aefbe09ce5d3e15a6fe.server.js'),
})
