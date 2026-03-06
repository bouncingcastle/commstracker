import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['a0bae16780184a4589ffd55fc8408d0c'],
    name: 'Commission Plan Tier Validation',
    table: 'x_823178_commissio_plan_tiers',
    order: 40,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates tier scope and range bands to prevent ambiguous or overlapping setup',
    script: Now.include('./sys_script_a0bae16780184a4589ffd55fc8408d0c.server.js'),
})
