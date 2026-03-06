import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['a1f85c27ebdb4d928d58142579476cb0'],
    name: 'Commission Plan Tier Validation',
    table: 'x_823178_commissio_plan_tiers',
    order: 40,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates tier scope and range bands to prevent ambiguous or overlapping setup',
    script: Now.include('./sys_script_a1f85c27ebdb4d928d58142579476cb0.server.js'),
})
