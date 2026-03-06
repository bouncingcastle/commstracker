import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['c320f71f6dd9485985e91faaeb7918f1'],
    name: 'Plan Bonus Validation',
    table: 'x_823178_commissio_plan_bonuses',
    order: 42,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates structured bonus qualification fields and composes a deterministic condition summary',
    script: Now.include('./sys_script_c320f71f6dd9485985e91faaeb7918f1.server.js'),
})
