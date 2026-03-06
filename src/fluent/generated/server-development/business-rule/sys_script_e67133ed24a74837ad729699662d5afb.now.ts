import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['e67133ed24a74837ad729699662d5afb'],
    name: 'Commission Plan Tier Validation',
    table: 'x_823178_commissio_plan_tiers',
    order: 40,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates tier scope and range bands to prevent ambiguous or overlapping setup',
    script: Now.include('./sys_script_e67133ed24a74837ad729699662d5afb.server.js'),
})
