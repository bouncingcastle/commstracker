import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['aa19b87d2efd43dda7a65bcdba56bd09'],
    name: 'Plan Bonus Validation',
    table: 'x_823178_commissio_plan_bonuses',
    order: 42,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates structured bonus qualification fields and composes a deterministic condition summary',
    script: Now.include('./sys_script_aa19b87d2efd43dda7a65bcdba56bd09.server.js'),
})
