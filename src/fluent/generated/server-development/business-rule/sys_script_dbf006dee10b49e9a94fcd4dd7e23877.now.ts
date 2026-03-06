import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['dbf006dee10b49e9a94fcd4dd7e23877'],
    name: 'Commission Plan Tier Validation',
    table: 'x_823178_commissio_plan_tiers',
    order: 40,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates tier scope and range bands to prevent ambiguous or overlapping setup',
    script: Now.include('./sys_script_dbf006dee10b49e9a94fcd4dd7e23877.server.js'),
})
