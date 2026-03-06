import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['cfea0bb893ce41d8baeb063c320d5716'],
    name: 'Commission Plan Tier Validation',
    table: 'x_823178_commissio_plan_tiers',
    order: 40,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates tier scope and range bands to prevent ambiguous or overlapping setup',
    script: Now.include('./sys_script_cfea0bb893ce41d8baeb063c320d5716.server.js'),
})
