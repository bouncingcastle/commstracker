import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['c4d7156ac0234808adb8a09638e16a3e'],
    name: 'Plan Bonus Validation',
    table: 'x_823178_commissio_plan_bonuses',
    order: 42,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates structured bonus qualification fields and composes a deterministic condition summary',
    script: Now.include('./sys_script_c4d7156ac0234808adb8a09638e16a3e.server.js'),
})
