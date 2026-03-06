import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['9f5eb3b9104f45d08f683fc12914669b'],
    name: 'Commission Plan Tier Validation',
    table: 'x_823178_commissio_plan_tiers',
    order: 40,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates tier scope and range bands to prevent ambiguous or overlapping setup',
    script: Now.include('./sys_script_9f5eb3b9104f45d08f683fc12914669b.server.js'),
})
