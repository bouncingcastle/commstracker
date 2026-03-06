import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['eb482434863d4e6eac15e26e9810d038'],
    name: 'Plan Bonus Validation',
    table: 'x_823178_commissio_plan_bonuses',
    order: 42,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates structured bonus qualification fields and composes a deterministic condition summary',
    script: Now.include('./sys_script_eb482434863d4e6eac15e26e9810d038.server.js'),
})
