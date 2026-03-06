import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['24e07c3725c34027a69e6d3770ac1d02'],
    name: 'Plan Bonus Validation',
    table: 'x_823178_commissio_plan_bonuses',
    order: 42,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates structured bonus qualification fields and composes a deterministic condition summary',
    script: Now.include('./sys_script_24e07c3725c34027a69e6d3770ac1d02.server.js'),
})
