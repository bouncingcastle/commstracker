import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['261a876de65f435a85a3358a9b9a34c1'],
    name: 'Commission Plan Tier Validation',
    table: 'x_823178_commissio_plan_tiers',
    order: 40,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates tier scope and range bands to prevent ambiguous or overlapping setup',
    script: Now.include('./sys_script_261a876de65f435a85a3358a9b9a34c1.server.js'),
})
