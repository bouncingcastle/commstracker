import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['2de8b477f9fc42278302002532637cf8'],
    name: 'Commission Plan Tier Validation',
    table: 'x_823178_commissio_plan_tiers',
    order: 40,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates tier scope and range bands to prevent ambiguous or overlapping setup',
    script: Now.include('./sys_script_2de8b477f9fc42278302002532637cf8.server.js'),
})
