import { BusinessRule } from '@servicenow/sdk/core'

BusinessRule({
    $id: Now.ID['4cbc9f6bff014e8d9b502630a701c6f2'],
    name: 'Plan Bonus Validation',
    table: 'x_823178_commissio_plan_bonuses',
    order: 42,
    when: 'before',
    action: ['update', 'insert'],
    description: 'Validates structured bonus qualification fields and composes a deterministic condition summary',
    script: Now.include('./sys_script_4cbc9f6bff014e8d9b502630a701c6f2.server.js'),
})
