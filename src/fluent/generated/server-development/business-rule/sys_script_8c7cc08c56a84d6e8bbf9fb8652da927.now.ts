import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['8c7cc08c56a84d6e8bbf9fb8652da927'],
    name: 'Plan Bonus Validation',
    table: 'x_823178_commissio_plan_bonuses',
    order: 42,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates structured bonus qualification fields and composes a deterministic condition summary',
    script: Now.include('./sys_script_8c7cc08c56a84d6e8bbf9fb8652da927.server.js'),
})
