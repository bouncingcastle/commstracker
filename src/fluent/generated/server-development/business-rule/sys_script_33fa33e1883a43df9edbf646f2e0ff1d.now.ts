import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['33fa33e1883a43df9edbf646f2e0ff1d'],
    name: 'Commission Plan Tier Validation',
    table: 'x_823178_commissio_plan_tiers',
    order: 40,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates tier scope and range bands to prevent ambiguous or overlapping setup',
    script: Now.include('./sys_script_33fa33e1883a43df9edbf646f2e0ff1d.server.js'),
})
