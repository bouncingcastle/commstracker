import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['2a7355bd55cb4b13ae24149a62854418'],
    name: 'Plan Bonus Validation',
    table: 'x_823178_commissio_plan_bonuses',
    order: 42,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates structured bonus qualification fields and composes a deterministic condition summary',
    script: Now.include('./sys_script_2a7355bd55cb4b13ae24149a62854418.server.js'),
})
