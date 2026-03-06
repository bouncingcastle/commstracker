import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['3a1ca8bb82b647e6af28fce0864cec0a'],
    name: 'Plan Bonus Validation',
    table: 'x_823178_commissio_plan_bonuses',
    order: 42,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates structured bonus qualification fields and composes a deterministic condition summary',
    script: Now.include('./sys_script_3a1ca8bb82b647e6af28fce0864cec0a.server.js'),
})
