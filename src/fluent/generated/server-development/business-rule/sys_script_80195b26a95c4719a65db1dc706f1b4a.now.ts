import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['80195b26a95c4719a65db1dc706f1b4a'],
    name: 'Plan Bonus Validation',
    table: 'x_823178_commissio_plan_bonuses',
    order: 42,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates structured bonus qualification fields and composes a deterministic condition summary',
    script: Now.include('./sys_script_80195b26a95c4719a65db1dc706f1b4a.server.js'),
})
