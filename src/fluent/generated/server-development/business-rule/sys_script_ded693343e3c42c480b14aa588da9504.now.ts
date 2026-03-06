import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['ded693343e3c42c480b14aa588da9504'],
    name: 'Plan Bonus Validation',
    table: 'x_823178_commissio_plan_bonuses',
    order: 42,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates structured bonus qualification fields and composes a deterministic condition summary',
    script: Now.include('./sys_script_ded693343e3c42c480b14aa588da9504.server.js'),
})
