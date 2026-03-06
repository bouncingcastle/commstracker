import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['3f36ca0b7f9446bdbe7686421e899c45'],
    name: 'Plan Bonus Validation',
    table: 'x_823178_commissio_plan_bonuses',
    order: 42,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates structured bonus qualification fields and composes a deterministic condition summary',
    script: Now.include('./sys_script_3f36ca0b7f9446bdbe7686421e899c45.server.js'),
})
