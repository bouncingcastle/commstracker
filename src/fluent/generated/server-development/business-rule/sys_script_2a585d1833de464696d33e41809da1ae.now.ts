import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['2a585d1833de464696d33e41809da1ae'],
    name: 'Commission Plan Tier Validation',
    table: 'x_823178_commissio_plan_tiers',
    order: 40,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates tier scope and range bands to prevent ambiguous or overlapping setup',
    script: Now.include('./sys_script_2a585d1833de464696d33e41809da1ae.server.js'),
})
