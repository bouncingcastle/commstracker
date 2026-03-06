import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['2095573255ee451aa3c5dd689aaddb85'],
    name: 'Commission Plan Tier Validation',
    table: 'x_823178_commissio_plan_tiers',
    order: 40,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates tier scope and range bands to prevent ambiguous or overlapping setup',
    script: Now.include('./sys_script_2095573255ee451aa3c5dd689aaddb85.server.js'),
})
